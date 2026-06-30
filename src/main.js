const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  dialog,
  ipcMain,
  nativeImage,
  screen,
  shell
} = require("electron");
const { scanSources } = require("./core/scanner");
const { createMovePlan, applyMovePlan, undoMoveHistory } = require("./core/mover");
const { mergeCategories, applyManualAssignments } = require("./core/catalog");
const { redactPath } = require("./core/privacy");
const { createStore } = require("./core/store");
const { DRAWER_STATES, nextDrawerState } = require("./core/drawer-state");
const { isUsableIconDataUrl } = require("./core/icon-fallback");
const { normalizeLanguage, translate } = require("./core/i18n");
const { distanceToAreaEdges, virtualAreaFromAreas } = require("./core/virtual-edge");
const { isDesktopSurfaceActive, getForegroundState } = require("./platform/desktop-state");
const { getDesktopIconsHidden, setDesktopIconsHidden } = require("./platform/desktop-icons");

app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-gpu-compositing");
app.commandLine.appendSwitch("disable-gpu-sandbox");
if (process.env.DESKTOP_ORGANIZER_SMOKE === "1") {
  const smokeDataDir = path.join(os.tmpdir(), "desktop-organizer-smoke-" + process.pid);
  app.setPath("userData", smokeDataDir);
  app.commandLine.appendSwitch("in-process-gpu");
  app.commandLine.appendSwitch("no-sandbox");
  app.commandLine.appendSwitch("user-data-dir", smokeDataDir);
}

let store;
let mainWindow;
let tray;
let latestScan = null;
let dockMode = DRAWER_STATES.collapsed;
let pointerInside = false;
let desktopAllowed = true;
let foregroundState = {
  supported: false,
  className: "",
  processName: "",
  isMaximized: false,
  isFullscreen: false
};
let foregroundSuppressed = false;
let pointerTimer = null;
let desktopTimer = null;
let animationTimer = null;
let isAnimating = false;
let interactionLock = false;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const FALLBACK_TRAY_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAIklEQVR42mNkYGBg+M+ABzDhkxyMGoaBoeE/AwMDKQAA5dYCHnlyLT8AAAAASUVORK5CYII=";

function assetPath(fileName) {
  return path.join(__dirname, "..", "assets", fileName);
}

function appIconPath() {
  return process.platform === "win32" ? assetPath("icon.ico") : assetPath("icon.png");
}

function trayImage() {
  const image = nativeImage.createFromPath(appIconPath());
  if (!image.isEmpty()) {
    return image.resize({ width: 16, height: 16 });
  }
  return nativeImage.createFromDataURL(FALLBACK_TRAY_ICON).resize({ width: 16, height: 16 });
}

function currentSettings() {
  return store.getState().dockSettings;
}

function currentAppearance() {
  return store.getState().appearanceSettings;
}

function appLanguage() {
  return normalizeLanguage(currentAppearance().language || app.getLocale());
}

function tr(key) {
  return translate(appLanguage(), key);
}

function getDisplayForPoint(x, y) {
  return screen.getDisplayNearestPoint({ x, y });
}

function defaultDockPoint() {
  const display = screen.getPrimaryDisplay();
  const area = display.workArea;
  return {
    x: area.x + area.width - 12,
    y: area.y + Math.round(area.height / 3)
  };
}

function getDockPoint() {
  const settings = currentSettings();
  const fallback = defaultDockPoint();
  return {
    x: Number.isFinite(settings.x) ? settings.x : fallback.x,
    y: Number.isFinite(settings.y) ? settings.y : fallback.y
  };
}

function virtualWorkArea() {
  return virtualAreaFromAreas(screen.getAllDisplays().map((display) => display.workArea));
}

function nearestDisplayEdgeDistance(point) {
  return screen
    .getAllDisplays()
    .map((display) => distanceToAreaEdges(display.workArea, point))
    .sort((a, b) => a.value - b.value)[0];
}

function nearestVirtualEdge(point) {
  return distanceToAreaEdges(virtualWorkArea(), point);
}

function snapPointToVirtualEdge(point, edge) {
  const area = virtualWorkArea();
  return {
    x: edge === "left" ? area.x : edge === "right" ? area.x + area.width : clamp(point.x, area.x, area.x + area.width),
    y: edge === "top" ? area.y : edge === "bottom" ? area.y + area.height : clamp(point.y, area.y, area.y + area.height)
  };
}

function displayForOuterEdge(edge, point) {
  const displays = screen.getAllDisplays();
  const virtualArea = virtualWorkArea();
  const outerValue = edge === "left"
    ? virtualArea.x
    : edge === "right"
      ? virtualArea.x + virtualArea.width
      : edge === "top"
        ? virtualArea.y
        : virtualArea.y + virtualArea.height;

  const candidates = displays.filter((display) => {
    const area = display.workArea;
    const displayValue = edge === "left"
      ? area.x
      : edge === "right"
        ? area.x + area.width
        : edge === "top"
          ? area.y
          : area.y + area.height;
    return Math.abs(displayValue - outerValue) <= 1;
  });

  const choices = candidates.length ? candidates : displays;
  return choices
    .map((display) => {
      const area = display.workArea;
      const centerX = area.x + area.width / 2;
      const centerY = area.y + area.height / 2;
      const distance = edge === "left" || edge === "right" ? Math.abs(point.y - centerY) : Math.abs(point.x - centerX);
      return { display, distance };
    })
    .sort((a, b) => a.distance - b.distance)[0].display;
}

function dockWorkAreaForEdge(edge, point) {
  return displayForOuterEdge(edge, point).workArea;
}

function normalizeDockEdgeSettings() {
  if (!store) return;
  const settings = currentSettings();
  const point = getDockPoint();
  if (settings.positionMode === "free") {
    const nearestAny = nearestDisplayEdgeDistance(point);
    const nearestOuter = nearestVirtualEdge(point);
    if (nearestAny.value <= 96 && nearestOuter.value > 96) {
      const snapped = snapPointToVirtualEdge(point, nearestOuter.edge);
      store.updateSettings({ edge: nearestOuter.edge, x: snapped.x, y: snapped.y, positionMode: "edge" });
    }
    return;
  }
  const edge = settings.edge || "right";
  const snapped = snapPointToVirtualEdge(point, edge);
  if (Math.abs(point.x - snapped.x) > 1 || Math.abs(point.y - snapped.y) > 1) {
    store.updateSettings({ x: snapped.x, y: snapped.y, positionMode: "edge" });
  }
}

function validDockMode(mode) {
  return Object.values(DRAWER_STATES).includes(mode) ? mode : DRAWER_STATES.collapsed;
}

function activeDockEdge(mode = dockMode) {
  const settings = currentSettings();
  const point = getDockPoint();
  if (validDockMode(mode) === DRAWER_STATES.expanded) {
    return settings.edge || "right";
  }
  return settings.positionMode === "free" ? nearestVirtualEdge(point).edge : settings.edge || "right";
}

function computeDockBounds(mode = dockMode) {
  const settings = currentSettings();
  const point = getDockPoint();
  const storedEdge = settings.edge || "right";
  const freeMode = settings.positionMode === "free";
  const virtualArea = virtualWorkArea();
  const collapsed = clamp(Number(settings.collapsedSize) || 48, 32, 96);
  const peekSize = clamp(Number(settings.peekSize) || 7, 6, collapsed);
  const peekWidth = clamp(Number(settings.peekWidth) || 48, peekSize, 120);
  const normalizedMode = validDockMode(mode);
  const drawerEdge = freeMode ? nearestVirtualEdge(point).edge : storedEdge;
  const edge = normalizedMode === DRAWER_STATES.expanded ? storedEdge : drawerEdge;
  const area = normalizedMode === DRAWER_STATES.expanded && freeMode
    ? getDisplayForPoint(point.x, point.y).workArea
    : dockWorkAreaForEdge(edge, point);

  if (normalizedMode !== DRAWER_STATES.expanded) {
    const visible = normalizedMode === DRAWER_STATES.peek ? peekWidth : peekSize;
    const width = edge === "left" || edge === "right" ? Math.max(collapsed, visible) : collapsed;
    const height = edge === "top" || edge === "bottom" ? Math.max(collapsed, visible) : collapsed;
    let x = point.x - width / 2;
    let y = point.y - height / 2;

    if (edge === "left") {
      x = virtualArea.x - width + visible;
      y = clamp(y, area.y, area.y + area.height - height);
    } else if (edge === "right") {
      x = virtualArea.x + virtualArea.width - visible;
      y = clamp(y, area.y, area.y + area.height - height);
    } else if (edge === "top") {
      y = virtualArea.y - height + visible;
      x = clamp(x, area.x, area.x + area.width - width);
    } else {
      y = virtualArea.y + virtualArea.height - visible;
      x = clamp(x, area.x, area.x + area.width - width);
    }

    return {
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height)
    };
  }

  let width = Math.min(settings.expandedSize.width, area.width);
  let height = Math.min(settings.expandedSize.height, area.height);
  let x = point.x - width / 2;
  let y = point.y - height / 2;

  if (!freeMode) {
    if (edge === "left") {
      x = virtualArea.x;
      y = clamp(y, area.y, area.y + area.height - height);
    } else if (edge === "right") {
      x = virtualArea.x + virtualArea.width - width;
      y = clamp(y, area.y, area.y + area.height - height);
    } else if (edge === "top") {
      y = virtualArea.y;
      x = clamp(x, area.x, area.x + area.width - width);
    } else if (edge === "bottom") {
      y = virtualArea.y + virtualArea.height - height;
      x = clamp(x, area.x, area.x + area.width - width);
    }
  }

  return {
    x: Math.round(clamp(x, virtualArea.x, virtualArea.x + virtualArea.width - width)),
    y: Math.round(clamp(y, virtualArea.y, virtualArea.y + virtualArea.height - height)),
    width: Math.round(width),
    height: Math.round(height)
  };
}

function intersectWorkArea(bounds) {
  const area = virtualWorkArea();
  const x1 = Math.max(bounds.x, area.x);
  const y1 = Math.max(bounds.y, area.y);
  const x2 = Math.min(bounds.x + bounds.width, area.x + area.width);
  const y2 = Math.min(bounds.y + bounds.height, area.y + area.height);
  return {
    x: x1,
    y: y1,
    width: Math.max(1, x2 - x1),
    height: Math.max(1, y2 - y1)
  };
}

function pointerDistanceToRect(point, rect) {
  const dx = Math.max(rect.x - point.x, 0, point.x - (rect.x + rect.width));
  const dy = Math.max(rect.y - point.y, 0, point.y - (rect.y + rect.height));
  return Math.hypot(dx, dy);
}

function sendDockState() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  const state = store.getState();
  mainWindow.webContents.send("dock:state", {
    mode: dockMode,
    expanded: dockMode === DRAWER_STATES.expanded,
    desktopAllowed,
    foregroundState,
    foregroundSuppressed,
    edge: activeDockEdge(),
    settings: state.dockSettings,
    desktopSettings: state.desktopSettings,
    appearanceSettings: state.appearanceSettings,
    skins: state.skins
  });
}

function animateBounds(targetBounds, done) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  clearInterval(animationTimer);
  const settings = currentSettings();
  const duration = Math.max(0, Number(settings.animationMs) || 0);
  const startBounds = mainWindow.getBounds();
  const startOpacity = mainWindow.getOpacity();
  const targetOpacity = settings.opacity;

  if (!duration || !mainWindow.isVisible()) {
    mainWindow.setOpacity(targetOpacity);
    mainWindow.setBounds(targetBounds, false);
    if (done) done();
    return;
  }

  isAnimating = true;
  const startedAt = Date.now();
  animationTimer = setInterval(() => {
    const progress = clamp((Date.now() - startedAt) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const next = {
      x: Math.round(startBounds.x + (targetBounds.x - startBounds.x) * eased),
      y: Math.round(startBounds.y + (targetBounds.y - startBounds.y) * eased),
      width: Math.round(startBounds.width + (targetBounds.width - startBounds.width) * eased),
      height: Math.round(startBounds.height + (targetBounds.height - startBounds.height) * eased)
    };
    mainWindow.setOpacity(startOpacity + (targetOpacity - startOpacity) * eased);
    mainWindow.setBounds(next, false);

    if (progress >= 1) {
      clearInterval(animationTimer);
      isAnimating = false;
      mainWindow.setBounds(targetBounds, false);
      mainWindow.setOpacity(targetOpacity);
      if (done) done();
    }
  }, 16);
}

function shouldSuppressForeground(info = foregroundState) {
  const settings = currentSettings();
  if (!settings.suppressOverMaximized || settings.allowCoverFullscreen) {
    return false;
  }
  if (!info || !info.supported) {
    return false;
  }
  return Boolean(info.isMaximized || info.isFullscreen);
}

function canShowDock() {
  const settings = currentSettings();
  return !settings.hiddenByUser && (!settings.desktopOnlyMode || desktopAllowed);
}

function applyDockBounds(mode = dockMode, animated = true) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  const target = computeDockBounds(mode);
  if (animated) {
    animateBounds(target, sendDockState);
  } else {
    mainWindow.setOpacity(currentSettings().opacity);
    mainWindow.setBounds(target, false);
    sendDockState();
  }
}

function setDockMode(nextMode, animated = true) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return dockMode;
  }

  dockMode = validDockMode(nextMode);

  if (!canShowDock()) {
    mainWindow.hide();
    sendDockState();
    return dockMode;
  }

  if (foregroundSuppressed && dockMode !== DRAWER_STATES.expanded && !pointerInside && !interactionLock) {
    mainWindow.hide();
    sendDockState();
    return dockMode;
  }

  if (!mainWindow.isVisible()) {
    mainWindow.setBounds(computeDockBounds(DRAWER_STATES.collapsed), false);
    mainWindow.showInactive();
  }

  mainWindow.setIgnoreMouseEvents(false);
  applyDockBounds(dockMode, animated);
  return dockMode;
}

function transitionDock(event, animated = true) {
  if (interactionLock && (event?.type === "pointerFar" || event?.type === "collapse")) {
    return dockMode;
  }
  const next = nextDrawerState(dockMode, event);
  return setDockMode(next, animated);
}

function setDockHidden(hidden) {
  store.updateSettings({ hiddenByUser: hidden });
  if (hidden) {
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.hide();
    dockMode = DRAWER_STATES.collapsed;
    sendDockState();
  } else {
    setDockMode(DRAWER_STATES.collapsed, false);
  }
  updateTrayMenu();
}

function applyLaunchAtLogin(enabled) {
  if (!app.isPackaged) {
    return;
  }
  app.setLoginItemSettings({
    openAtLogin: Boolean(enabled)
  });
}

async function updateDesktopAndForeground() {
  if (!store) {
    return;
  }

  if (!currentSettings().desktopOnlyMode) {
    desktopAllowed = true;
  } else {
    desktopAllowed = await isDesktopSurfaceActive();
  }

  foregroundState = await getForegroundState();
  foregroundSuppressed = shouldSuppressForeground(foregroundState);

  if ((!canShowDock() || foregroundSuppressed) && !pointerInside && !interactionLock && mainWindow && mainWindow.isVisible()) {
    dockMode = DRAWER_STATES.collapsed;
    mainWindow.hide();
    sendDockState();
  }
}

function startPointerPolling() {
  clearInterval(pointerTimer);
  clearInterval(desktopTimer);
  desktopTimer = setInterval(updateDesktopAndForeground, 750);
  pointerTimer = setInterval(() => {
    if (!mainWindow || mainWindow.isDestroyed() || isAnimating) {
      return;
    }

    const settings = currentSettings();
    if (settings.hiddenByUser) {
      return;
    }

    if (foregroundSuppressed && !pointerInside && !interactionLock) {
      if (mainWindow.isVisible()) {
        dockMode = DRAWER_STATES.collapsed;
        mainWindow.hide();
        sendDockState();
      }
      return;
    }

    const point = screen.getCursorScreenPoint();
    const modeForDistance = mainWindow.isVisible() ? dockMode : DRAWER_STATES.collapsed;
    const bounds = modeForDistance === DRAWER_STATES.expanded ? mainWindow.getBounds() : computeDockBounds(modeForDistance);
    const visibleRect = modeForDistance === DRAWER_STATES.expanded ? bounds : intersectWorkArea(bounds);
    const distance = pointerDistanceToRect(point, visibleRect);
    const near = distance <= settings.wakeRadius;
    const far = distance >= settings.hideRadius;

    if (!mainWindow.isVisible() && near) {
      transitionDock({ type: "pointerNear" }, true);
      return;
    }

    if (dockMode === DRAWER_STATES.collapsed && near) {
      transitionDock({ type: "pointerNear" }, true);
      return;
    }

    if (dockMode !== DRAWER_STATES.collapsed && !pointerInside && !interactionLock && far) {
      transitionDock({ type: "pointerFar" }, true);
    }
  }, 120);
}

function updateTrayMenu() {
  if (!tray) {
    return;
  }

  const hidden = currentSettings().hiddenByUser;
  const zh = appLanguage() === "zh-CN";
  const template = [
    {
      label: hidden ? (zh ? "\u663e\u793a\u6574\u7406\u9762\u677f" : "Show Organizer") : (zh ? "\u9690\u85cf\u6574\u7406\u9762\u677f" : "Hide Organizer"),
      click: () => setDockHidden(!hidden)
    },
    {
      label: zh ? "\u7acb\u5373\u626b\u63cf" : "Scan Now",
      click: async () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          setDockHidden(false);
          mainWindow.webContents.send("scan:request");
        }
      }
    },
    { type: "separator" },
    {
      label: zh ? "\u9000\u51fa" : "Quit",
      click: () => app.quit()
    }
  ];
  tray.setContextMenu(Menu.buildFromTemplate(template));
  tray.setToolTip(zh ? "\u684c\u9762\u6574\u7406" : "Desktop Organizer");
}

function createTray() {
  tray = new Tray(trayImage());
  tray.on("click", () => setDockHidden(false));
  updateTrayMenu();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 48,
    height: 48,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    show: false,
    skipTaskbar: true,
    hasShadow: false,
    alwaysOnTop: true,
    icon: appIconPath(),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.setAlwaysOnTop(true, "screen-saver");
  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
  mainWindow.once("ready-to-show", () => setDockMode(DRAWER_STATES.collapsed, false));
}

function buildCatalogForState(rawItems) {
  const state = store.getState();
  const categories = mergeCategories(state.customCategories);
  const categoryIds = new Set(categories.map((category) => category.id));
  const filteredAssignments = Object.fromEntries(
    Object.entries(state.manualAssignments).filter(([, categoryId]) => categoryIds.has(categoryId))
  );
  const items = applyManualAssignments(rawItems, filteredAssignments);
  return { categories, items };
}

async function performScan() {
  const state = store.getState();
  const rawScan = await scanSources(state.sources);
  const catalog = buildCatalogForState(rawScan.items);
  latestScan = {
    ...rawScan,
    categories: catalog.categories,
    items: catalog.items
  };
  store.update({
    categories: latestScan.categories,
    items: latestScan.items,
    lastScan: latestScan.scannedAt
  });

  if (store.getState().desktopSettings.hideIconsAfterScan && process.env.DESKTOP_ORGANIZER_SMOKE !== "1") {
    const result = await setDesktopIconsHidden(true);
    store.updateDesktopSettings({ iconsHidden: Boolean(result.hidden) });
  }

  return {
    ...latestScan,
    settings: currentSettings(),
    desktopSettings: store.getState().desktopSettings,
    appearanceSettings: store.getState().appearanceSettings,
    skins: store.getState().skins,
    moveHistory: store.getState().moveHistory
  };
}

function itemsByIds(itemIds) {
  const ids = new Set(itemIds || []);
  const items = latestScan?.items || store.getState().items || [];
  if (!ids.size) {
    return items.filter((item) => item.movable);
  }
  return items.filter((item) => ids.has(item.id));
}

function uniqueExistingCandidates(candidates) {
  const seen = new Set();
  return candidates.filter((candidate) => {
    if (!candidate || /^https?:\/\//i.test(candidate)) return false;
    const normalized = path.resolve(candidate);
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return fs.existsSync(normalized);
  });
}

function iconCandidatesForItem(item) {
  const candidates = [];
  const sourcePath = item?.sourcePath || null;
  const targetPath = item?.targetPath || null;
  const isShortcut = sourcePath && path.extname(sourcePath).toLowerCase() === ".lnk";

  if (isShortcut) {
    try {
      const details = shell.readShortcutLink(sourcePath);
      if (details.icon) candidates.push(details.icon);
      if (details.target) candidates.push(details.target);
    } catch {}
  }

  candidates.push(targetPath, sourcePath);
  return uniqueExistingCandidates(candidates);
}

async function getItemIconDataUrl(item) {
  const candidates = iconCandidatesForItem(item);
  for (const candidate of candidates) {
    const key = item.id + ":" + candidate;
    const cached = store.getIconCache(key);
    if (isUsableIconDataUrl(cached)) {
      return cached;
    }

    try {
      const image = await app.getFileIcon(candidate, { size: "normal" });
      if (!image || image.isEmpty()) {
        continue;
      }
      const resized = image.resize({ width: 32, height: 32 });
      if (resized.isEmpty()) {
        continue;
      }
      const dataUrl = resized.toDataURL();
      if (isUsableIconDataUrl(dataUrl)) {
        store.setIconCache(key, dataUrl);
        return dataUrl;
      }
    } catch {}
  }
  return null;
}

function mimeForFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".gif") return "image/gif";
  if (ext === ".webp") return "image/webp";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "image/png";
}

function skinTargetFields(target) {
  if (target === "panel") {
    return {
      filePrefix: "panel",
      pathKey: "panelSkinPath",
      typeKey: "panelSkinType",
      dataKey: "panelSkinDataUrl"
    };
  }
  return {
    filePrefix: "handle",
    pathKey: "handleSkinPath",
    typeKey: "handleSkinType",
    dataKey: "handleSkinDataUrl"
  };
}

function normalizePanelSkinBuffer(buffer, mime) {
  if (mime === "image/gif") {
    return { buffer, mime, ext: ".gif" };
  }

  const image = nativeImage.createFromBuffer(buffer);
  if (image.isEmpty()) {
    return { buffer, mime, ext: mime === "image/webp" ? ".webp" : mime === "image/jpeg" ? ".jpg" : ".png" };
  }

  const size = image.getSize();
  const maxSide = Math.max(size.width, size.height);
  const normalized = maxSide > 1600
    ? image.resize({
        width: Math.max(1, Math.round(size.width * 1600 / maxSide)),
        height: Math.max(1, Math.round(size.height * 1600 / maxSide)),
        quality: "best"
      })
    : image;
  return { buffer: normalized.toPNG(), mime: "image/png", ext: ".png" };
}

async function saveSkinFromPayload(payload, target = "handle") {
  const skinDir = path.join(store.userDataPath, "skins");
  const fields = skinTargetFields(target);
  await fsp.mkdir(skinDir, { recursive: true });

  if (payload.dataUrl) {
    const match = payload.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      throw new Error("Invalid skin image data.");
    }
    const mime = match[1];
    const sourceBuffer = Buffer.from(match[2], "base64");
    const normalized = target === "panel" ? normalizePanelSkinBuffer(sourceBuffer, mime) : { buffer: sourceBuffer, mime, ext: mime === "image/gif" ? ".gif" : ".png" };
    const skinPath = path.join(skinDir, fields.filePrefix + normalized.ext);
    const dataUrl = "data:" + normalized.mime + ";base64," + normalized.buffer.toString("base64");
    const patch = {
      [fields.pathKey]: skinPath,
      [fields.typeKey]: normalized.mime,
      [fields.dataKey]: dataUrl
    };
    if (target === "handle") patch.crop = payload.crop || null;
    if (target === "panel") patch.panelCrop = normalized.mime === "image/gif" ? null : payload.crop || null;
    await fsp.writeFile(skinPath, normalized.buffer);
    return store.updateSkins(patch);
  }

  if (payload.sourcePath) {
    const sourceExt = path.extname(payload.sourcePath).toLowerCase();
    const ext = [".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(sourceExt) ? sourceExt : ".png";
    const sourceMime = mimeForFile(payload.sourcePath);
    const sourceBuffer = await fsp.readFile(payload.sourcePath);
    const normalized = target === "panel" ? normalizePanelSkinBuffer(sourceBuffer, sourceMime) : { buffer: sourceBuffer, mime: sourceMime, ext };
    const skinPath = path.join(skinDir, fields.filePrefix + normalized.ext);
    await fsp.writeFile(skinPath, normalized.buffer);
    const dataUrl = "data:" + normalized.mime + ";base64," + normalized.buffer.toString("base64");
    const patch = {
      [fields.pathKey]: skinPath,
      [fields.typeKey]: normalized.mime,
      [fields.dataKey]: dataUrl
    };
    if (target === "handle") patch.crop = payload.crop || null;
    if (target === "panel") patch.panelCrop = normalized.mime === "image/gif" ? null : payload.crop || null;
    return store.updateSkins(patch);
  }

  throw new Error("No skin image selected.");
}

async function selectSkinImage(titleKey) {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: tr(titleKey),
    properties: ["openFile"],
    filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp", "gif"] }]
  });
  if (result.canceled || !result.filePaths.length) {
    return null;
  }
  const sourcePath = result.filePaths[0];
  const mime = mimeForFile(sourcePath);
  const dataUrl = "data:" + mime + ";base64," + (await fsp.readFile(sourcePath)).toString("base64");
  return { sourcePath, mime, dataUrl, isGif: mime === "image/gif" };
}

function sanitizeSettingsPatch(patch) {
  const allowedEdges = new Set(["left", "right", "top", "bottom"]);
  const allowedModes = new Set(["edge", "free"]);
  const nextPatch = { ...(patch || {}) };
  if (nextPatch.edge && !allowedEdges.has(nextPatch.edge)) delete nextPatch.edge;
  if (nextPatch.positionMode && !allowedModes.has(nextPatch.positionMode)) delete nextPatch.positionMode;
  if (nextPatch.opacity !== undefined) nextPatch.opacity = clamp(Number(nextPatch.opacity), 0.25, 1);
  if (nextPatch.autoHideDelayMs !== undefined) nextPatch.autoHideDelayMs = clamp(Number(nextPatch.autoHideDelayMs), 150, 2500);
  if (nextPatch.wakeRadius !== undefined) nextPatch.wakeRadius = clamp(Number(nextPatch.wakeRadius), 24, 260);
  if (nextPatch.hideRadius !== undefined) nextPatch.hideRadius = clamp(Number(nextPatch.hideRadius), 80, 700);
  if (nextPatch.animationMs !== undefined) nextPatch.animationMs = clamp(Number(nextPatch.animationMs), 0, 800);
  if (nextPatch.peekSize !== undefined) nextPatch.peekSize = clamp(Number(nextPatch.peekSize), 6, 24);
  if (nextPatch.peekWidth !== undefined) nextPatch.peekWidth = clamp(Number(nextPatch.peekWidth), 32, 120);
  if (nextPatch.suppressOverMaximized !== undefined) nextPatch.suppressOverMaximized = Boolean(nextPatch.suppressOverMaximized);
  if (nextPatch.allowCoverFullscreen !== undefined) nextPatch.allowCoverFullscreen = Boolean(nextPatch.allowCoverFullscreen);
  if (nextPatch.clickToExpand !== undefined) nextPatch.clickToExpand = Boolean(nextPatch.clickToExpand);
  return nextPatch;
}

function sanitizeAppearancePatch(patch) {
  const nextPatch = { ...(patch || {}) };
  if (nextPatch.language !== undefined) nextPatch.language = normalizeLanguage(nextPatch.language);
  if (nextPatch.panelBlurPx !== undefined) nextPatch.panelBlurPx = clamp(Number(nextPatch.panelBlurPx), 0, 40);
  if (nextPatch.panelOpacity !== undefined) nextPatch.panelOpacity = clamp(Number(nextPatch.panelOpacity), 0.35, 1);
  return nextPatch;
}

function registerIpc() {
  ipcMain.handle("scan:sources", performScan);
  ipcMain.handle("sources:list", () => store.getState().sources);

  ipcMain.handle("sources:add", async (_event, sourcePath) => {
    let selectedPath = sourcePath;
    if (!selectedPath) {
      const result = await dialog.showOpenDialog(mainWindow, {
        title: tr("addFolder"),
        properties: ["openDirectory"]
      });
      if (result.canceled || !result.filePaths.length) {
        return null;
      }
      selectedPath = result.filePaths[0];
    }
    return store.addSource(selectedPath);
  });

  ipcMain.handle("sources:remove", (_event, sourceId) => store.removeSource(sourceId));

  ipcMain.handle("move:preview", async (_event, itemIds) => {
    if (!latestScan) {
      await performScan();
    }
    return createMovePlan(itemsByIds(itemIds), currentSettings().destinationRoot);
  });

  ipcMain.handle("move:apply", async (_event, plan) => {
    const history = await applyMovePlan(plan);
    store.addMoveHistory(history);
    return history;
  });

  ipcMain.handle("move:undo", async () => {
    const lastMove = store.popLastMoveHistory();
    if (!lastMove) {
      return null;
    }
    return undoMoveHistory(lastMove);
  });

  ipcMain.handle("settings:get", () => currentSettings());
  ipcMain.handle("desktopSettings:get", () => store.getState().desktopSettings);
  ipcMain.handle("appearance:get", () => currentAppearance());
  ipcMain.handle("skin:get", () => store.getState().skins);

  ipcMain.handle("settings:update", (_event, patch) => {
    const settings = store.updateSettings(sanitizeSettingsPatch(patch));
    foregroundSuppressed = shouldSuppressForeground(foregroundState);
    applyLaunchAtLogin(settings.launchAtLogin);
    applyDockBounds(dockMode, true);
    updateTrayMenu();
    return settings;
  });

  ipcMain.handle("appearance:update", (_event, patch) => {
    const appearance = store.updateAppearanceSettings(sanitizeAppearancePatch(patch));
    updateTrayMenu();
    sendDockState();
    return appearance;
  });

  ipcMain.handle("desktopIcons:get", async () => {
    const hidden = await getDesktopIconsHidden();
    return store.updateDesktopSettings({ iconsHidden: hidden });
  });

  ipcMain.handle("desktopIcons:set", async (_event, hidden) => {
    const result = await setDesktopIconsHidden(Boolean(hidden));
    const nextSettings = store.updateDesktopSettings({ iconsHidden: Boolean(result.hidden) });
    return {
      ...nextSettings,
      error: result.error || (result.viewFound === false ? tr("desktopIconsDeferred") : null),
      desktopIconResult: result
    };
  });

  ipcMain.handle("desktopSettings:update", (_event, patch) => store.updateDesktopSettings(patch || {}));

  ipcMain.handle("icons:getItemIcon", async (_event, item) => getItemIconDataUrl(item));

  ipcMain.handle("skin:select", () => selectSkinImage("buttonSkin"));
  ipcMain.handle("skin:selectPanel", () => selectSkinImage("panelSkin"));

  ipcMain.handle("skin:save", async (_event, payload) => saveSkinFromPayload(payload || {}, "handle"));
  ipcMain.handle("skin:savePanel", async (_event, payload) => saveSkinFromPayload(payload || {}, "panel"));
  ipcMain.handle("skin:reset", async () => store.updateSkins({ handleSkinPath: null, handleSkinType: null, handleSkinDataUrl: null, crop: null }));
  ipcMain.handle("skin:resetPanel", async () => store.updateSkins({ panelSkinPath: null, panelSkinType: null, panelSkinDataUrl: null, panelCrop: null }));

  ipcMain.handle("categories:list", () => mergeCategories(store.getState().customCategories));
  ipcMain.handle("categories:create", (_event, name, accent) => store.createCustomCategory(name, accent));
  ipcMain.handle("categories:update", (_event, categoryId, patch) => store.updateCustomCategory(categoryId, patch || {}));
  ipcMain.handle("categories:delete", (_event, categoryId) => store.deleteCustomCategory(categoryId));
  ipcMain.handle("categories:assignItem", (_event, itemId, categoryId) => store.assignItemCategory(itemId, categoryId));

  ipcMain.handle("search:update", (_event, query, activeCategoryId) => {
    mainWindow.webContents.send("search:updated", { query, activeCategoryId });
    return { query, activeCategoryId };
  });

  ipcMain.handle("app:launchItem", async (_event, item) => {
    const target = item?.targetPath || item?.sourcePath;
    if (!target) return "No target path.";
    if (/^https?:\/\//i.test(target)) {
      await shell.openExternal(target);
      return "";
    }
    return shell.openPath(target);
  });

  ipcMain.handle("app:revealItem", async (_event, item) => {
    if (!item?.sourcePath) return "No source path.";
    shell.showItemInFolder(item.sourcePath);
    return "";
  });

  ipcMain.handle("app:redactPath", (_event, filePath) => redactPath(filePath, app.getPath("home")));

  ipcMain.handle("dock:getPointerState", () => {
    const point = screen.getCursorScreenPoint();
    return { point, bounds: mainWindow ? mainWindow.getBounds() : null, mode: dockMode, expanded: dockMode === DRAWER_STATES.expanded };
  });

  ipcMain.handle("dock:updateHotspotSettings", (_event, patch) => {
    const settings = store.updateSettings(sanitizeSettingsPatch(patch));
    applyDockBounds(dockMode, true);
    return settings;
  });

  ipcMain.handle("dock:setPeekVisible", (_event, visible) => {
    transitionDock({ type: visible ? "pointerNear" : "collapse", interacting: pointerInside }, true);
    return dockMode;
  });

  ipcMain.handle("dock:clickHandle", () => {
    transitionDock({ type: "handleClick" }, true);
    return dockMode;
  });

  ipcMain.handle("dock:setExpanded", (_event, expanded) => {
    transitionDock({ type: expanded ? "expand" : "collapse", interacting: pointerInside }, true);
    return dockMode === DRAWER_STATES.expanded;
  });

  ipcMain.handle("dock:setHidden", (_event, hidden) => {
    setDockHidden(Boolean(hidden));
    return currentSettings();
  });

  ipcMain.handle("dock:setPointerInside", (_event, inside) => {
    pointerInside = Boolean(inside);
    return pointerInside;
  });

  ipcMain.handle("dock:setInteractionLock", (_event, locked) => {
    interactionLock = Boolean(locked);
    if (interactionLock) {
      pointerInside = true;
      setDockMode(DRAWER_STATES.expanded, true);
    }
    sendDockState();
    return interactionLock;
  });

  ipcMain.handle("window:getForegroundState", async () => getForegroundState());

  ipcMain.handle("dock:drag", (_event, point) => {
    if (!mainWindow || mainWindow.isDestroyed()) return null;
    pointerInside = true;
    const bounds = mainWindow.getBounds();
    const offsetX = Number.isFinite(point.offsetX) ? point.offsetX : bounds.width / 2;
    const offsetY = Number.isFinite(point.offsetY) ? point.offsetY : bounds.height / 2;
    const next = {
      x: Math.round(point.screenX - offsetX),
      y: Math.round(point.screenY - offsetY),
      width: bounds.width,
      height: bounds.height
    };
    mainWindow.setBounds(next, false);
    return mainWindow.getBounds();
  });

  ipcMain.handle("dock:endDrag", (_event, point) => {
    pointerInside = false;
    const dragPoint = { x: point.screenX, y: point.screenY };
    const nearestAnyDisplayEdge = nearestDisplayEdgeDistance(dragPoint);
    const nearestOuterEdge = nearestVirtualEdge(dragPoint);
    const snap = nearestAnyDisplayEdge.value <= 88 || nearestOuterEdge.value <= 88;
    const snapEdge = nearestAnyDisplayEdge.value <= 88 ? nearestAnyDisplayEdge.edge : nearestOuterEdge.edge;
    const bounds = mainWindow.getBounds();
    const snappedPoint = snapPointToVirtualEdge(dragPoint, snapEdge);
    store.updateSettings({
      edge: snap ? snapEdge : currentSettings().edge,
      positionMode: snap ? "edge" : "free",
      x: snap ? snappedPoint.x : bounds.x + bounds.width / 2,
      y: snap ? snappedPoint.y : bounds.y + bounds.height / 2
    });
    applyDockBounds(dockMode, true);
    return currentSettings();
  });
}

async function restoreDesktopIconsIfNeeded() {
  if (!store) return;
  const settings = store.getState().desktopSettings;
  if (settings.restoreIconsOnQuit && settings.iconsHidden) {
    await setDesktopIconsHidden(false);
  }
}

app.whenReady().then(async () => {
  store = createStore(app.getPath("userData"));
  applyLaunchAtLogin(currentSettings().launchAtLogin);
  registerIpc();
  createTray();
  normalizeDockEdgeSettings();
  await updateDesktopAndForeground();
  createWindow();
  startPointerPolling();

  if (process.env.DESKTOP_ORGANIZER_SMOKE === "1") {
    setTimeout(() => {
      if (tray) tray.destroy();
      app.quit();
    }, 1500);
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("before-quit", (event) => {
  if (!store || process.env.DESKTOP_ORGANIZER_SMOKE === "1") {
    return;
  }
  event.preventDefault();
  restoreDesktopIconsIfNeeded().finally(() => {
    app.exit(0);
  });
});

app.on("window-all-closed", () => {
  // Keep the tray process alive so the organizer can be shown again.
});
