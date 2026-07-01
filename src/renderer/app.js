const api = window.organizer;

const TEXT = {
  "zh-CN": {
    "appTitle": "\u684c\u9762\u6574\u7406",
    "idle": "\u5c31\u7eea",
    "scan": "\u626b\u63cf",
    "hide": "\u9690\u85cf",
    "searchPlaceholder": "\u641c\u7d22\u5e94\u7528\u548c\u6587\u4ef6",
    "all": "\u5168\u90e8",
    "allItems": "\u5168\u90e8\u9879\u76ee",
    "select": "\u9009\u62e9",
    "move": "\u79fb\u52a8",
    "undo": "\u64a4\u9500",
    "settings": "\u8bbe\u7f6e",
    "edge": "\u8d34\u8fb9",
    "left": "\u5de6\u4fa7",
    "right": "\u53f3\u4fa7",
    "top": "\u9876\u90e8",
    "bottom": "\u5e95\u90e8",
    "opacity": "\u628a\u624b\u900f\u660e\u5ea6",
    "panelOpacity": "\u9762\u677f\u900f\u660e\u5ea6",
    "panelBlur": "\u80cc\u666f\u6a21\u7cca",
    "wakeRadius": "\u5524\u9192\u8303\u56f4",
    "hideRadius": "\u9690\u85cf\u8303\u56f4",
    "animation": "\u52a8\u753b",
    "hideDelay": "\u9690\u85cf\u5ef6\u8fdf",
    "language": "\u8bed\u8a00",
    "launchAtLogin": "\u5f00\u673a\u542f\u52a8",
    "desktopOnly": "\u4ec5\u684c\u9762\u663e\u793a",
    "suppressMaximized": "\u6700\u5927\u5316\u7a97\u53e3\u4e0a\u65b9\u4e0d\u5f39\u51fa",
    "hideIconsAfterScan": "\u626b\u63cf\u540e\u9690\u85cf\u684c\u9762\u56fe\u6807",
    "restoreIconsOnQuit": "\u9000\u51fa\u65f6\u6062\u590d\u684c\u9762\u56fe\u6807",
    "showDesktopIcons": "\u663e\u793a\u684c\u9762\u56fe\u6807",
    "hideDesktopIcons": "\u9690\u85cf\u684c\u9762\u56fe\u6807",
    "quickShowIcons": "\u663e\u793a\u56fe\u6807",
    "quickHideIcons": "\u9690\u85cf\u56fe\u6807",
    "showingIcons": "\u6b63\u5728\u663e\u793a\u684c\u9762\u56fe\u6807",
    "hidingIcons": "\u6b63\u5728\u9690\u85cf\u684c\u9762\u56fe\u6807",
    "desktopIconsUpdated": "\u684c\u9762\u56fe\u6807\u72b6\u6001\u5df2\u66f4\u65b0",
    "buttonSkin": "\u66f4\u6362\u56fe\u6807",
    "resetSkin": "\u91cd\u7f6e\u56fe\u6807",
    "panelSkin": "\u66f4\u6362\u9762\u677f\u76ae\u80a4",
    "resetPanelSkin": "\u91cd\u7f6e\u9762\u677f\u76ae\u80a4",
    "panelSkinUpdated": "\u9762\u677f\u76ae\u80a4\u5df2\u66f4\u65b0",
    "panelSkinResetDone": "\u9762\u677f\u76ae\u80a4\u5df2\u91cd\u7f6e",
    "cropPanelSkin": "\u66f4\u6362\u9762\u677f\u76ae\u80a4",
    "savePanelSkin": "\u4fdd\u5b58\u9762\u677f\u76ae\u80a4",
    "panelGifOriginal": "GIF \u9762\u677f\u76ae\u80a4\u5df2\u4f7f\u7528\u539f\u56fe\u5c45\u4e2d\u94fa\u6ee1",
    "appearance": "\u5916\u89c2\u9884\u89c8",
    "sources": "\u6765\u6e90",
    "addFolder": "\u6dfb\u52a0\u6587\u4ef6\u5939",
    "noCustomFolders": "\u6682\u65e0\u81ea\u5b9a\u4e49\u6587\u4ef6\u5939",
    "cropButtonSkin": "\u66f4\u6362\u62bd\u5c49\u6309\u94ae\u56fe\u6807",
    "close": "\u5173\u95ed",
    "saveSkin": "\u4fdd\u5b58\u56fe\u6807",
    "noItems": "\u6682\u65e0\u9879\u76ee",
    "noSearchResults": "\u6ca1\u6709\u641c\u7d22\u7ed3\u679c",
    "info": "\u8be6\u60c5",
    "open": "\u6253\u5f00",
    "remove": "\u79fb\u9664",
    "scanning": "\u6b63\u5728\u626b\u63cf",
    "scanFailed": "\u626b\u63cf\u5931\u8d25",
    "nothingMovable": "\u6ca1\u6709\u53ef\u79fb\u52a8\u9879\u76ee",
    "moving": "\u6b63\u5728\u79fb\u52a8",
    "moved": "\u5df2\u79fb\u52a8",
    "failed": "\u5931\u8d25",
    "undoing": "\u6b63\u5728\u64a4\u9500",
    "nothingToUndo": "\u6ca1\u6709\u53ef\u64a4\u9500\u8bb0\u5f55",
    "restored": "\u5df2\u6062\u590d",
    "newCategoryName": "\u65b0\u5206\u7c7b\u540d\u79f0",
    "categoryName": "\u5206\u7c7b\u540d\u79f0",
    "deleteCategory": "\u5220\u9664\u5206\u7c7b",
    "manualCategoryReason": "\u624b\u52a8\u5206\u7c7b\u3002",
    "moveConfirm": "\u5c06\u9009\u4e2d\u7684\u9879\u76ee\u79fb\u52a8\u5230\u6258\u7ba1\u6574\u7406\u76ee\u5f55\uff1f",
    "folder": "\u6587\u4ef6\u5939",
    "cancel": "\u53d6\u6d88",
    "finalPreview": "\u6700\u7ec8\u6548\u679c",
    "cropX": "\u6a2a\u5411\u4f4d\u7f6e",
    "cropY": "\u7eb5\u5411\u4f4d\u7f6e",
    "cropSize": "\u88c1\u526a\u5927\u5c0f",
    "pinned": "\u5e38\u7528",
    "recent": "\u6700\u8fd1\u6253\u5f00",
    "pinItem": "\u56fa\u5b9a\u5230\u5e38\u7528",
    "unpinItem": "\u53d6\u6d88\u56fa\u5b9a",
    "reveal": "\u6253\u5f00\u6240\u5728\u4f4d\u7f6e",
    "copyPath": "\u590d\u5236\u8def\u5f84",
    "copied": "\u5df2\u590d\u5236\u8def\u5f84",
    "hideFromList": "\u4ece\u5217\u8868\u9690\u85cf",
    "itemHidden": "\u5df2\u4ece\u5217\u8868\u9690\u85cf",
    "moveToOrganizer": "\u79fb\u52a8\u5230\u6258\u7ba1\u76ee\u5f55",
    "changeCategory": "\u4fee\u6539\u5206\u7c7b",
    "ignoredItems": "\u5ffd\u7565\u5217\u8868",
    "restore": "\u6062\u590d",
    "restoreAll": "\u5168\u90e8\u6062\u590d",
    "noIgnoredItems": "\u6682\u65e0\u5ffd\u7565\u9879\u76ee",
    "selectionMode": "\u9009\u62e9\u6a21\u5f0f",
  },
  "en-US": {
    "appTitle": "Desktop Organizer",
    "idle": "Idle",
    "scan": "Scan",
    "hide": "Hide",
    "searchPlaceholder": "Search apps and files",
    "all": "All",
    "allItems": "All Items",
    "select": "Select",
    "move": "Move",
    "undo": "Undo",
    "settings": "Settings",
    "edge": "Edge",
    "left": "Left",
    "right": "Right",
    "top": "Top",
    "bottom": "Bottom",
    "opacity": "Handle opacity",
    "panelOpacity": "Panel opacity",
    "panelBlur": "Background blur",
    "wakeRadius": "Wake radius",
    "hideRadius": "Hide radius",
    "animation": "Animation",
    "hideDelay": "Hide delay",
    "language": "Language",
    "launchAtLogin": "Launch at login",
    "desktopOnly": "Desktop only",
    "suppressMaximized": "Do not appear over maximized windows",
    "hideIconsAfterScan": "Hide desktop icons after scan",
    "restoreIconsOnQuit": "Restore icons on quit",
    "showDesktopIcons": "Show Desktop Icons",
    "hideDesktopIcons": "Hide Desktop Icons",
    "quickShowIcons": "Show Icons",
    "quickHideIcons": "Hide Icons",
    "showingIcons": "Showing desktop icons",
    "hidingIcons": "Hiding desktop icons",
    "desktopIconsUpdated": "Desktop icon state updated",
    "buttonSkin": "Change Icon",
    "resetSkin": "Reset Icon",
    "panelSkin": "Change Panel Skin",
    "resetPanelSkin": "Reset Panel Skin",
    "panelSkinUpdated": "Panel skin updated",
    "panelSkinResetDone": "Panel skin reset",
    "cropPanelSkin": "Change Panel Skin",
    "savePanelSkin": "Save Panel Skin",
    "panelGifOriginal": "GIF panel skin uses the original centered image",
    "appearance": "Appearance Preview",
    "sources": "Sources",
    "addFolder": "Add Folder",
    "noCustomFolders": "No custom folders",
    "cropButtonSkin": "Change Drawer Button Icon",
    "close": "Close",
    "saveSkin": "Save Icon",
    "noItems": "No items",
    "noSearchResults": "No search results",
    "info": "Info",
    "open": "Open",
    "remove": "Remove",
    "scanning": "Scanning",
    "scanFailed": "Scan failed",
    "nothingMovable": "Nothing movable",
    "moving": "Moving",
    "moved": "moved",
    "failed": "failed",
    "undoing": "Undoing",
    "nothingToUndo": "Nothing to undo",
    "restored": "restored",
    "newCategoryName": "New category name",
    "categoryName": "Category name",
    "deleteCategory": "Delete category",
    "manualCategoryReason": "Manual category assignment.",
    "moveConfirm": "Move selected item(s) to the managed organizer folder?",
    "folder": "Folder",
    "cancel": "Cancel",
    "finalPreview": "Final preview",
    "cropX": "X position",
    "cropY": "Y position",
    "cropSize": "Crop size",
    "pinned": "Pinned",
    "recent": "Recent",
    "pinItem": "Pin to Pinned",
    "unpinItem": "Unpin",
    "reveal": "Show in Folder",
    "copyPath": "Copy Path",
    "copied": "Path copied",
    "hideFromList": "Hide from List",
    "itemHidden": "Hidden from list",
    "moveToOrganizer": "Move to Organizer",
    "changeCategory": "Change Category",
    "ignoredItems": "Ignored Items",
    "restore": "Restore",
    "restoreAll": "Restore All",
    "noIgnoredItems": "No ignored items",
    "selectionMode": "Selection Mode",
  }
};

const CATEGORY_NAMES = {
  "zh-CN": {
    documents: "文档",
    images: "图片",
    videos: "视频",
    audio: "音频",
    archives: "压缩包",
    development: "开发工具",
    games: "游戏",
    applications: "应用",
    folders: "文件夹",
    other: "其他"
  },
  "en-US": {}
};

const state = {
  categories: [],
  items: [],
  sources: [],
  settings: null,
  desktopSettings: null,
  appearanceSettings: null,
  skins: null,
  activeCategoryId: null,
  query: "",
  selectedIds: new Set(),
  hideTimer: null,
  scrollInteractionTimer: null,
  dragging: false,
  dragMoved: false,
  suppressHandleClick: false,
  dragStart: { x: 0, y: 0 },
  dragOffset: { x: 0, y: 0 },
  pendingSkin: null,
  pendingSkinImage: null,
  pendingSkinTarget: "handle",
  iconDataUrlCache: new Map(),
  cropDragging: false,
  cropDragStart: { x: 0, y: 0 },
  cropDragOrigin: { sx: 0, sy: 0, cropWidth: 0, cropHeight: 0 },
  composing: false,
  interacting: false,
  selectionMode: false,
  contextItem: null,
  pinnedItems: [],
  recentItems: [],
  ignoredItems: [],
  dockMode: "collapsed"
};

const elements = {
  app: document.getElementById("app"),
  panelScroll: document.getElementById("panelScroll"),
  dockHandle: document.getElementById("dockHandle"),
  handleSkin: document.getElementById("handleSkin"),
  handleMark: document.getElementById("handleMark"),
  dragHeader: document.getElementById("dragHeader"),
  appTitle: document.getElementById("appTitle"),
  scanBtn: document.getElementById("scanBtn"),
  hideBtn: document.getElementById("hideBtn"),
  desktopIconsQuickBtn: document.getElementById("desktopIconsQuickBtn"),
  scanStatus: document.getElementById("scanStatus"),
  searchInput: document.getElementById("searchInput"),
  allSearchBtn: document.getElementById("allSearchBtn"),
  newCategoryBtn: document.getElementById("newCategoryBtn"),
  quickShelves: document.getElementById("quickShelves"),
  pinnedShelf: document.getElementById("pinnedShelf"),
  pinnedShelfTitle: document.getElementById("pinnedShelfTitle"),
  pinnedShelfItems: document.getElementById("pinnedShelfItems"),
  recentShelf: document.getElementById("recentShelf"),
  recentShelfTitle: document.getElementById("recentShelfTitle"),
  recentShelfItems: document.getElementById("recentShelfItems"),
  categoryList: document.getElementById("categoryList"),
  activeCategoryName: document.getElementById("activeCategoryName"),
  itemCount: document.getElementById("itemCount"),
  itemList: document.getElementById("itemList"),
  selectVisibleBtn: document.getElementById("selectVisibleBtn"),
  moveBtn: document.getElementById("moveBtn"),
  undoBtn: document.getElementById("undoBtn"),
  settingsSummary: document.getElementById("settingsSummary"),
  languageSelect: document.getElementById("languageSelect"),
  languageLabel: document.getElementById("languageLabel"),
  edgeSelect: document.getElementById("edgeSelect"),
  edgeLabel: document.getElementById("edgeLabel"),
  edgeLeftOption: document.getElementById("edgeLeftOption"),
  edgeRightOption: document.getElementById("edgeRightOption"),
  edgeTopOption: document.getElementById("edgeTopOption"),
  edgeBottomOption: document.getElementById("edgeBottomOption"),
  opacityInput: document.getElementById("opacityInput"),
  opacityLabel: document.getElementById("opacityLabel"),
  panelOpacityInput: document.getElementById("panelOpacityInput"),
  panelOpacityLabel: document.getElementById("panelOpacityLabel"),
  panelBlurInput: document.getElementById("panelBlurInput"),
  panelBlurLabel: document.getElementById("panelBlurLabel"),
  wakeRadiusInput: document.getElementById("wakeRadiusInput"),
  wakeRadiusLabel: document.getElementById("wakeRadiusLabel"),
  hideRadiusInput: document.getElementById("hideRadiusInput"),
  hideRadiusLabel: document.getElementById("hideRadiusLabel"),
  animationInput: document.getElementById("animationInput"),
  animationLabel: document.getElementById("animationLabel"),
  delayInput: document.getElementById("delayInput"),
  hideDelayLabel: document.getElementById("hideDelayLabel"),
  loginInput: document.getElementById("loginInput"),
  loginLabel: document.getElementById("loginLabel"),
  desktopOnlyInput: document.getElementById("desktopOnlyInput"),
  desktopOnlyLabel: document.getElementById("desktopOnlyLabel"),
  suppressMaximizedInput: document.getElementById("suppressMaximizedInput"),
  suppressMaximizedLabel: document.getElementById("suppressMaximizedLabel"),
  hideIconsInput: document.getElementById("hideIconsInput"),
  hideIconsLabel: document.getElementById("hideIconsLabel"),
  restoreIconsInput: document.getElementById("restoreIconsInput"),
  restoreIconsLabel: document.getElementById("restoreIconsLabel"),
  showDesktopIconsBtn: document.getElementById("showDesktopIconsBtn"),
  hideDesktopIconsBtn: document.getElementById("hideDesktopIconsBtn"),
  panelSkinBtn: document.getElementById("panelSkinBtn"),
  resetPanelSkinBtn: document.getElementById("resetPanelSkinBtn"),
  skinBtn: document.getElementById("skinBtn"),
  resetSkinBtn: document.getElementById("resetSkinBtn"),
  panelSkinPreview: document.getElementById("panelSkinPreview"),
  sourcesSummary: document.getElementById("sourcesSummary"),
  addSourceBtn: document.getElementById("addSourceBtn"),
  sourceList: document.getElementById("sourceList"),
  ignoredSummary: document.getElementById("ignoredSummary"),
  ignoredList: document.getElementById("ignoredList"),
  restoreAllIgnoredBtn: document.getElementById("restoreAllIgnoredBtn"),
  contextMenu: document.getElementById("contextMenu"),
  skinModal: document.getElementById("skinModal"),
  cropTitle: document.getElementById("cropTitle"),
  closeSkinModalBtn: document.getElementById("closeSkinModalBtn"),
  cancelSkinBtn: document.getElementById("cancelSkinBtn"),
  skinCanvas: document.getElementById("skinCanvas"),
  skinFinalPreview: document.getElementById("skinFinalPreview"),
  skinFinalPreviewImage: document.getElementById("skinFinalPreviewImage"),
  skinFinalPreviewMark: document.getElementById("skinFinalPreviewMark"),
  skinFinalPreviewLabel: document.getElementById("skinFinalPreviewLabel"),
  cropXLabel: document.getElementById("cropXLabel"),
  cropYLabel: document.getElementById("cropYLabel"),
  cropSizeLabel: document.getElementById("cropSizeLabel"),
  cropXInput: document.getElementById("cropXInput"),
  cropYInput: document.getElementById("cropYInput"),
  cropSizeInput: document.getElementById("cropSizeInput"),
  saveSkinBtn: document.getElementById("saveSkinBtn")
};

function normalizeLanguage(value) {
  const current = String(value || "zh-CN").toLowerCase();
  if (current.startsWith("zh")) return "zh-CN";
  if (current.startsWith("en")) return "en-US";
  return "en-US";
}

function language() {
  return normalizeLanguage(state.appearanceSettings && state.appearanceSettings.language);
}

function t(key) {
  return (TEXT[language()] && TEXT[language()][key]) || TEXT["en-US"][key] || key;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function setStatus(text) {
  elements.scanStatus.textContent = text;
}

function statusItems(count) {
  return language() === "zh-CN" ? String(count) + " 个项目" : String(count) + " items";
}

function normalize(value) {
  return String(value || "").toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function categoryDisplayName(category) {
  if (!category) return t("allItems");
  return CATEGORY_NAMES[language()][category.id] || category.name;
}

function itemKey(item = {}) {
  return item.key || String(item.sourcePath || item.targetPath || item.id || item.name || "").toLowerCase();
}

function ignoredKeySet() {
  return new Set((state.ignoredItems || []).map((item) => item.key));
}

function isPinned(item) {
  const key = itemKey(item);
  return Boolean(key && (state.pinnedItems || []).some((candidate) => candidate.key === key));
}

function currentItemForRef(ref) {
  const key = itemKey(ref);
  return state.items.find((item) => itemKey(item) === key) || ref;
}

async function refreshQuickItems() {
  state.pinnedItems = await api.listPinnedItems();
  state.recentItems = await api.listRecentItems();
  renderShelves();
}

function appendAsyncIcon(parent, item, category) {
  const iconCacheKey = itemIconCacheKey(item);
  const cachedIcon = state.iconDataUrlCache.get(iconCacheKey);
  if (cachedIcon) {
    parent.appendChild(itemIconImage(cachedIcon));
    return;
  }
  const iconHolder = fallbackIcon(category);
  parent.appendChild(iconHolder);
  api.getItemIcon(item).then((dataUrl) => {
    if (!dataUrl || !parent.isConnected || !iconHolder.isConnected) return;
    const image = itemIconImage();
    image.onload = () => {
      if (!parent.isConnected || !iconHolder.isConnected) return;
      try {
        if (!imageHasUsefulPixels(image)) return;
      } catch {
        return;
      }
      state.iconDataUrlCache.set(iconCacheKey, dataUrl);
      iconHolder.replaceWith(image);
    };
    image.onerror = () => {};
    image.src = dataUrl;
  });
}

function createShelfButton(ref) {
  const item = currentItemForRef(ref);
  const category = state.categories.find((candidate) => candidate.id === item.categoryId);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "shelf-item";
  button.title = item.name || "";
  appendAsyncIcon(button, item, category);
  const label = document.createElement("span");
  label.textContent = item.name || "";
  button.appendChild(label);
  button.addEventListener("click", () => openItem(item));
  button.addEventListener("contextmenu", (event) => showContextMenu(event, item));
  return button;
}

function renderShelf(container, titleNode, items, limit) {
  container.classList.toggle("hidden", !items.length || Boolean(state.query));
  titleNode.textContent = titleNode === elements.pinnedShelfTitle ? t("pinned") : t("recent");
  const list = titleNode === elements.pinnedShelfTitle ? elements.pinnedShelfItems : elements.recentShelfItems;
  list.innerHTML = "";
  for (const item of items.slice(0, limit)) {
    list.appendChild(createShelfButton(item));
  }
}

function renderShelves() {
  const ignored = ignoredKeySet();
  const pinned = (state.pinnedItems || []).filter((item) => !ignored.has(item.key));
  const recent = (state.recentItems || []).filter((item) => !ignored.has(item.key) && !pinned.some((pinnedItem) => pinnedItem.key === item.key));
  renderShelf(elements.pinnedShelf, elements.pinnedShelfTitle, pinned, 12);
  renderShelf(elements.recentShelf, elements.recentShelfTitle, recent, 8);
  const visible = !state.query && (pinned.length || recent.length);
  elements.quickShelves.classList.toggle("hidden", !visible);
}

function categoryCounts() {
  const counts = new Map();
  for (const item of state.items) {
    counts.set(item.categoryId, (counts.get(item.categoryId) || 0) + 1);
  }
  return counts;
}

function activeCategory() {
  if (!state.activeCategoryId) return null;
  return state.categories.find((category) => category.id === state.activeCategoryId) || null;
}

function itemMatchesQuery(item) {
  if (!state.query) return true;
  const haystack = normalize([item.name, item.sourceLabel, item.reason, item.kind].join(" "));
  return haystack.includes(normalize(state.query));
}

function visibleItems() {
  return state.items.filter((item) => {
    if (state.activeCategoryId && item.categoryId !== state.activeCategoryId) return false;
    return itemMatchesQuery(item);
  });
}

function updateActionState() {
  const selectedMovableCount = Array.from(state.selectedIds).filter((id) => {
    const item = state.items.find((candidate) => candidate.id === id);
    return item && item.movable;
  }).length;
  elements.moveBtn.hidden = !state.selectionMode;
  elements.undoBtn.hidden = !state.selectionMode;
  elements.moveBtn.disabled = selectedMovableCount === 0;
  elements.selectVisibleBtn.textContent = state.selectionMode ? t("cancel") : t("select");
  elements.moveBtn.textContent = selectedMovableCount ? t("move") + " " + selectedMovableCount : t("move");
}

function createCategoryButton(category, count) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "category-button" + (category.custom ? " custom" : "");
  button.style.setProperty("--category-accent", category.accent);
  if (category.id === state.activeCategoryId) button.classList.add("active");

  const name = document.createElement("span");
  name.className = "category-name";
  name.textContent = categoryDisplayName(category);
  const countNode = document.createElement("span");
  countNode.className = "category-count";
  countNode.textContent = String(count || 0);
  button.append(name, countNode);

  button.addEventListener("click", () => {
    state.activeCategoryId = category.id;
    api.updateSearch(state.query, state.activeCategoryId);
    render();
  });
  button.addEventListener("dragover", (event) => {
    event.preventDefault();
    button.classList.add("drop-target");
  });
  button.addEventListener("dragleave", () => button.classList.remove("drop-target"));
  button.addEventListener("drop", async (event) => {
    event.preventDefault();
    button.classList.remove("drop-target");
    const itemId = event.dataTransfer.getData("text/plain");
    if (!itemId) return;
    await api.assignItemCategory(itemId, category.id);
    const item = state.items.find((candidate) => candidate.id === itemId);
    if (item) {
      item.categoryId = category.id;
      item.manualCategory = true;
      item.reason = t("manualCategoryReason");
    }
    render();
  });

  if (category.custom) {
    button.title = language() === "zh-CN" ? "双击重命名，Shift + 双击删除。" : "Double click to rename. Shift + double click to delete.";
    button.addEventListener("dblclick", async (event) => {
      if (event.shiftKey) {
        if (window.confirm(t("deleteCategory") + " " + category.name + "?")) {
          await api.deleteCategory(category.id);
          if (state.activeCategoryId === category.id) state.activeCategoryId = null;
          await scan();
        }
        return;
      }
      const nextName = window.prompt(t("categoryName"), category.name);
      if (nextName && nextName.trim()) {
        await api.updateCategory(category.id, { name: nextName.trim() });
        await scan();
      }
    });
  }
  return button;
}

function renderCategories() {
  const counts = categoryCounts();
  elements.categoryList.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = "category-button";
  if (!state.activeCategoryId) allButton.classList.add("active");
  const allName = document.createElement("span");
  allName.className = "category-name";
  allName.textContent = t("all");
  const allCount = document.createElement("span");
  allCount.className = "category-count";
  allCount.textContent = String(state.items.length);
  allButton.append(allName, allCount);
  allButton.addEventListener("click", () => {
    state.activeCategoryId = null;
    api.updateSearch(state.query, null);
    render();
  });
  elements.categoryList.appendChild(allButton);

  for (const category of state.categories) {
    elements.categoryList.appendChild(createCategoryButton(category, counts.get(category.id) || 0));
  }
}

function fallbackIcon(category) {
  const icon = document.createElement("div");
  icon.className = "item-icon fallback";
  icon.style.setProperty("--category-accent", category ? category.accent : "#2563eb");
  icon.textContent = category ? category.icon : "IT";
  return icon;
}

function itemIconCacheKey(item) {
  return [item.key || item.id || "", item.sourcePath || "", item.targetPath || ""].join("|");
}

function itemIconImage(dataUrl) {
  const image = document.createElement("img");
  image.className = "item-icon";
  image.alt = "";
  if (dataUrl) image.src = dataUrl;
  return image;
}

function imageHasUsefulPixels(image) {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, 32, 32);
  const pixels = context.getImageData(0, 0, 32, 32).data;
  let visible = 0;
  let colored = 0;
  for (let index = 0; index < pixels.length; index += 16) {
    const alpha = pixels[index + 3];
    if (alpha <= 12) continue;
    visible += 1;
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    if (!(red > 245 && green > 245 && blue > 245)) colored += 1;
  }
  return visible > 12 && colored > 4;
}

function renderItems() {
  const category = activeCategory();
  const items = visibleItems();
  elements.app.classList.toggle("selection-mode", state.selectionMode);
  elements.activeCategoryName.textContent = category ? categoryDisplayName(category) : t("allItems");
  elements.itemCount.textContent = String(items.length);
  elements.itemList.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = state.query ? t("noSearchResults") : t("noItems");
    elements.itemList.appendChild(empty);
    updateActionState();
    return;
  }

  for (const item of items) {
    const itemCategory = state.categories.find((candidate) => candidate.id === item.categoryId);
    const row = document.createElement("article");
    const rowClasses = ["item-row"];
    if (state.selectionMode) rowClasses.push("selection-mode");
    if (!item.movable) rowClasses.push("not-movable");
    row.className = rowClasses.join(" ");
    row.draggable = true;
    row.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", item.id);
      event.dataTransfer.effectAllowed = "move";
      markInteracting(true);
    });
    row.addEventListener("dragend", () => releaseInteractingSoon());
    row.addEventListener("contextmenu", (event) => showContextMenu(event, item));

    if (state.selectionMode && item.movable) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = state.selectedIds.has(item.id);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) state.selectedIds.add(item.id);
        else state.selectedIds.delete(item.id);
        updateActionState();
      });
      row.appendChild(checkbox);
    }

    const iconCacheKey = itemIconCacheKey(item);
    const cachedIcon = state.iconDataUrlCache.get(iconCacheKey);
    if (cachedIcon) {
      row.appendChild(itemIconImage(cachedIcon));
    } else {
      const iconHolder = fallbackIcon(itemCategory);
      row.appendChild(iconHolder);
      api.getItemIcon(item).then((dataUrl) => {
        if (!dataUrl || !row.isConnected || !iconHolder.isConnected) return;
        const image = itemIconImage();
        image.onload = () => {
          if (!row.isConnected || !iconHolder.isConnected) return;
          try {
            if (!imageHasUsefulPixels(image)) return;
          } catch {
            return;
          }
          state.iconDataUrlCache.set(iconCacheKey, dataUrl);
          iconHolder.replaceWith(image);
        };
        image.onerror = () => {};
        image.src = dataUrl;
      });
    }

    const main = document.createElement("div");
    main.className = "item-main";
    const name = document.createElement("div");
    name.className = "item-name";
    name.textContent = item.name;
    const meta = document.createElement("div");
    meta.className = "item-meta";
    meta.textContent = item.sourceLabel + " - " + item.reason;
    main.append(name, meta);
    row.appendChild(main);

    const actions = document.createElement("div");
    actions.className = "item-actions";
    const infoButton = document.createElement("button");
    infoButton.type = "button";
    infoButton.textContent = t("info");
    infoButton.addEventListener("click", async () => setStatus(await api.redactPath(item.sourcePath)));
    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.className = "open-button";
    openButton.textContent = t("open");
    openButton.addEventListener("click", () => openItem(item));
    actions.append(infoButton, openButton);
    row.appendChild(actions);
    elements.itemList.appendChild(row);
  }
  updateActionState();
}

function renderSources() {
  elements.sourceList.innerHTML = "";
  if (!state.sources.length) {
    const empty = document.createElement("div");
    empty.className = "source-row";
    empty.textContent = t("noCustomFolders");
    elements.sourceList.appendChild(empty);
    return;
  }

  for (const source of state.sources) {
    const row = document.createElement("div");
    row.className = "source-row";
    const pathLabel = document.createElement("span");
    pathLabel.className = "source-path";
    pathLabel.textContent = source.label || t("folder");
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = t("remove");
    remove.addEventListener("click", async () => {
      state.sources = await api.removeSource(source.id);
      await scan();
    });
    row.append(pathLabel, remove);
    elements.sourceList.appendChild(row);
  }
}

function applyDockEdgeClass(edge) {
  const nextEdge = ["left", "right", "top", "bottom"].includes(edge) ? edge : "right";
  for (const candidate of ["left", "right", "top", "bottom"]) {
    elements.app.classList.toggle("edge-" + candidate, candidate === nextEdge);
  }
}

function applySkin() {
  const handleDataUrl = state.skins && state.skins.handleSkinDataUrl;
  if (handleDataUrl) {
    elements.handleSkin.src = handleDataUrl;
    elements.dockHandle.classList.add("has-skin");
  } else {
    elements.handleSkin.removeAttribute("src");
    elements.dockHandle.classList.remove("has-skin");
  }

  const panelDataUrl = state.skins && state.skins.panelSkinDataUrl;
  if (panelDataUrl) {
    document.documentElement.style.setProperty("--panel-skin-image", "url(\"" + panelDataUrl + "\")");
    elements.app.classList.add("has-panel-skin");
  } else {
    document.documentElement.style.setProperty("--panel-skin-image", "none");
    elements.app.classList.remove("has-panel-skin");
  }
}

function updateDesktopIconsQuickButton() {
  if (!elements.desktopIconsQuickBtn) return;
  const hidden = Boolean(state.desktopSettings && state.desktopSettings.iconsHidden);
  const key = hidden ? "quickShowIcons" : "quickHideIcons";
  elements.desktopIconsQuickBtn.textContent = t(key);
  elements.desktopIconsQuickBtn.title = t(key);
}

function applyAppearance() {
  const appearance = state.appearanceSettings || { language: "zh-CN", panelBlurPx: 18, panelOpacity: 0.96 };
  document.documentElement.lang = language();
  document.documentElement.style.setProperty("--panel-blur", String(appearance.panelBlurPx ?? 18) + "px");
  document.documentElement.style.setProperty("--panel-opacity", String(appearance.panelOpacity ?? 0.96));
  document.documentElement.style.setProperty("--panel-skin-overlay", String(Math.min(0.78, Number(appearance.panelOpacity ?? 0.96))));
  document.documentElement.style.setProperty("--panel-skin-blur", String(Math.round((appearance.panelBlurPx ?? 18) * 0.35)) + "px");
  if (elements.panelSkinPreview) elements.panelSkinPreview.textContent = t("appearance");
}

function applyI18n() {
  document.title = t("appTitle");
  elements.appTitle.textContent = t("appTitle");
  elements.dockHandle.title = t("appTitle");
  elements.scanBtn.textContent = t("scan");
  elements.scanBtn.title = t("scan");
  elements.hideBtn.textContent = t("hide");
  elements.hideBtn.title = t("hide");
  updateDesktopIconsQuickButton();
  elements.searchInput.placeholder = t("searchPlaceholder");
  elements.allSearchBtn.textContent = t("all");
  elements.undoBtn.textContent = t("undo");
  elements.settingsSummary.textContent = t("settings");
  elements.languageLabel.textContent = t("language");
  elements.edgeLabel.textContent = t("edge");
  elements.edgeLeftOption.textContent = t("left");
  elements.edgeRightOption.textContent = t("right");
  elements.edgeTopOption.textContent = t("top");
  elements.edgeBottomOption.textContent = t("bottom");
  elements.opacityLabel.textContent = t("opacity");
  elements.panelOpacityLabel.textContent = t("panelOpacity");
  elements.panelBlurLabel.textContent = t("panelBlur");
  elements.wakeRadiusLabel.textContent = t("wakeRadius");
  elements.hideRadiusLabel.textContent = t("hideRadius");
  elements.animationLabel.textContent = t("animation");
  elements.hideDelayLabel.textContent = t("hideDelay");
  elements.loginLabel.textContent = t("launchAtLogin");
  elements.desktopOnlyLabel.textContent = t("desktopOnly");
  elements.suppressMaximizedLabel.textContent = t("suppressMaximized");
  elements.hideIconsLabel.textContent = t("hideIconsAfterScan");
  elements.restoreIconsLabel.textContent = t("restoreIconsOnQuit");
  elements.showDesktopIconsBtn.textContent = t("showDesktopIcons");
  elements.hideDesktopIconsBtn.textContent = t("hideDesktopIcons");
  elements.panelSkinBtn.textContent = t("panelSkin");
  elements.resetPanelSkinBtn.textContent = t("resetPanelSkin");
  elements.skinBtn.textContent = t("buttonSkin");
  elements.resetSkinBtn.textContent = t("resetSkin");
  elements.sourcesSummary.textContent = t("sources");
  elements.addSourceBtn.textContent = t("addFolder");
  if (elements.pinnedShelfTitle) elements.pinnedShelfTitle.textContent = t("pinned");
  if (elements.recentShelfTitle) elements.recentShelfTitle.textContent = t("recent");
  if (elements.ignoredSummary) elements.ignoredSummary.textContent = t("ignoredItems") + " " + (state.ignoredItems || []).length;
  if (elements.restoreAllIgnoredBtn) elements.restoreAllIgnoredBtn.textContent = t("restoreAll");
  configureSkinModalForTarget();
  elements.closeSkinModalBtn.textContent = t("close");
  elements.cancelSkinBtn.textContent = t("cancel");
  elements.skinFinalPreviewLabel.textContent = t("finalPreview");
  elements.cropXLabel.textContent = t("cropX");
  elements.cropYLabel.textContent = t("cropY");
  elements.cropSizeLabel.textContent = t("cropSize");
  updateActionState();
}

function applySettingsToControls() {
  if (state.settings) {
    elements.edgeSelect.value = state.settings.edge;
    elements.opacityInput.value = state.settings.opacity;
    elements.wakeRadiusInput.value = state.settings.wakeRadius;
    elements.hideRadiusInput.value = state.settings.hideRadius;
    elements.animationInput.value = state.settings.animationMs;
    elements.delayInput.value = state.settings.autoHideDelayMs;
    elements.loginInput.checked = Boolean(state.settings.launchAtLogin);
    elements.desktopOnlyInput.checked = Boolean(state.settings.desktopOnlyMode);
    elements.suppressMaximizedInput.checked = state.settings.suppressOverMaximized !== false;
  }
  if (state.desktopSettings) {
    elements.hideIconsInput.checked = Boolean(state.desktopSettings.hideIconsAfterScan);
    elements.restoreIconsInput.checked = Boolean(state.desktopSettings.restoreIconsOnQuit);
    updateDesktopIconsQuickButton();
  }
  if (state.appearanceSettings) {
    elements.languageSelect.value = language();
    elements.panelBlurInput.value = state.appearanceSettings.panelBlurPx;
    elements.panelOpacityInput.value = state.appearanceSettings.panelOpacity;
  }
  applyAppearance();
  applySkin();
}

function render() {
  applyAppearance();
  applyI18n();
  renderCategories();
  renderShelves();
  renderItems();
  renderSources();
  renderIgnoredItems();
  applySettingsToControls();
}

async function scan() {
  setStatus(t("scanning"));
  elements.scanBtn.disabled = true;
  try {
    const result = await api.scanSources();
    state.categories = result.categories;
    state.items = result.items;
    state.sources = await api.listSources();
    state.pinnedItems = result.pinnedItems || [];
    state.recentItems = result.recentItems || [];
    state.ignoredItems = result.ignoredItems || [];
    state.settings = result.settings;
    state.desktopSettings = result.desktopSettings;
    state.appearanceSettings = result.appearanceSettings || state.appearanceSettings;
    state.skins = result.skins;
    for (const id of Array.from(state.selectedIds)) {
      if (!state.items.some((item) => item.id === id && item.movable)) state.selectedIds.delete(id);
    }
    setStatus(statusItems(result.items.length));
    render();
  } catch (error) {
    setStatus(error.message || t("scanFailed"));
  } finally {
    elements.scanBtn.disabled = false;
  }
}

async function loadSettings() {
  state.settings = await api.getSettings();
  state.desktopSettings = await api.getDesktopSettings();
  try {
    state.desktopSettings = await api.getDesktopIcons();
  } catch {}
  state.appearanceSettings = await api.getAppearance();
  state.skins = await api.getSkin();
  state.sources = await api.listSources();
  state.categories = await api.listCategories();
  state.pinnedItems = await api.listPinnedItems();
  state.recentItems = await api.listRecentItems();
  state.ignoredItems = await api.listIgnoredItems();
  render();
}

async function updateSettings(patch) {
  state.settings = await api.updateSettings(patch);
  applySettingsToControls();
}

async function updateAppearance(patch) {
  const previousLanguage = language();
  state.appearanceSettings = await api.updateAppearance(patch);
  const languageChanged = patch && patch.language !== undefined && previousLanguage !== language();
  if (languageChanged) {
    render();
    return;
  }
  applySettingsToControls();
}

async function updateDesktopSettings(patch) {
  state.desktopSettings = await api.updateDesktopSettings(patch);
  applySettingsToControls();
}

async function setDesktopIconsHidden(hidden) {
  const nextHidden = Boolean(hidden);
  elements.desktopIconsQuickBtn.disabled = true;
  setStatus(nextHidden ? t("hidingIcons") : t("showingIcons"));
  try {
    const result = await api.setDesktopIcons(nextHidden);
    state.desktopSettings = result;
    applySettingsToControls();
    setStatus(result && result.error ? result.error : t("desktopIconsUpdated"));
  } finally {
    elements.desktopIconsQuickBtn.disabled = false;
  }
}

async function toggleDesktopIcons() {
  const hidden = Boolean(state.desktopSettings && state.desktopSettings.iconsHidden);
  await setDesktopIconsHidden(!hidden);
}

function markInteracting(active) {
  window.clearTimeout(state.hideTimer);
  state.interacting = Boolean(active);
  api.setPointerInside(state.interacting || state.composing || state.dragging);
}

function hasActiveInput() {
  const active = document.activeElement;
  if (!active || active === document.body) return false;
  return Boolean(active.closest("input, textarea, select, [contenteditable=\"true\"], .modal:not(.hidden)"));
}

function releaseInteractingSoon() {
  window.clearTimeout(state.hideTimer);
  state.hideTimer = window.setTimeout(() => {
    if (state.composing || state.dragging || !elements.skinModal.classList.contains("hidden") || hasActiveInput()) {
      api.setPointerInside(true);
      return;
    }
    state.interacting = false;
    api.setPointerInside(false);
  }, state.settings ? state.settings.autoHideDelayMs : 480);
}

function keepScrollInteractionAlive() {
  markInteracting(true);
  window.clearTimeout(state.scrollInteractionTimer);
  state.scrollInteractionTimer = window.setTimeout(releaseInteractingSoon, 700);
}

function schedulePointerLeave() {
  if (state.composing || state.dragging || state.interacting || hasActiveInput()) {
    api.setPointerInside(true);
    return;
  }
  releaseInteractingSoon();
}

async function openItem(item) {
  const error = await api.launchItem(item);
  if (error) {
    setStatus(error);
    return;
  }
  await refreshQuickItems();
}

async function moveItems(itemIds) {
  const plan = await api.previewMove(itemIds);
  if (!plan.items.length) {
    setStatus(t("nothingMovable"));
    return false;
  }
  const confirmed = window.confirm(t("moveConfirm"));
  if (!confirmed) return false;
  setStatus(t("moving"));
  const history = await api.applyMove(plan);
  const moved = history.items.filter((item) => item.status === "moved").length;
  const failed = history.items.filter((item) => item.status === "failed").length;
  setStatus(failed ? moved + " " + t("moved") + ", " + failed + " " + t("failed") : moved + " " + t("moved"));
  await scan();
  return true;
}

function hideContextMenu() {
  elements.contextMenu.classList.add("hidden");
  elements.contextMenu.innerHTML = "";
  state.contextItem = null;
  releaseInteractingSoon();
}

function contextMenuButton(label, handler, danger = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  if (danger) button.classList.add("danger");
  button.addEventListener("click", async () => {
    try {
      await handler();
    } finally {
      hideContextMenu();
    }
  });
  return button;
}

function positionContextMenu(event) {
  const menu = elements.contextMenu;
  const width = 220;
  const height = Math.min(360, window.innerHeight - 16);
  const left = Math.min(event.clientX, window.innerWidth - width - 8);
  const top = Math.min(event.clientY, window.innerHeight - height - 8);
  menu.style.left = Math.max(8, left) + "px";
  menu.style.top = Math.max(8, top) + "px";
}

function showContextMenu(event, item) {
  event.preventDefault();
  event.stopPropagation();
  markInteracting(true);
  state.contextItem = item;
  const menu = elements.contextMenu;
  menu.innerHTML = "";
  const title = document.createElement("div");
  title.className = "context-title";
  title.textContent = item.name || "";
  menu.appendChild(title);
  menu.appendChild(contextMenuButton(t("open"), () => openItem(item)));
  menu.appendChild(contextMenuButton(t("reveal"), async () => {
    const error = await api.revealItem(item);
    if (error) setStatus(error);
  }));
  menu.appendChild(contextMenuButton(isPinned(item) ? t("unpinItem") : t("pinItem"), async () => {
    state.pinnedItems = isPinned(item) ? await api.unpinItem(itemKey(item)) : await api.pinItem(item);
    renderShelves();
  }));
  menu.appendChild(contextMenuButton(t("copyPath"), async () => {
    const error = await api.copyPath(item);
    setStatus(error || t("copied"));
  }));
  if (item.movable && item.id) {
    menu.appendChild(contextMenuButton(t("moveToOrganizer"), () => moveItems([item.id])));
  }
  if (item.id) {
    const categoryTitle = document.createElement("div");
    categoryTitle.className = "context-section-title";
    categoryTitle.textContent = t("changeCategory");
    menu.appendChild(categoryTitle);
    for (const category of state.categories) {
      menu.appendChild(contextMenuButton(categoryDisplayName(category), async () => {
        await api.assignItemCategory(item.id, category.id);
        const current = state.items.find((candidate) => candidate.id === item.id);
        if (current) {
          current.categoryId = category.id;
          current.manualCategory = true;
          current.reason = t("manualCategoryReason");
        }
        render();
      }));
    }
  }
  menu.appendChild(contextMenuButton(t("hideFromList"), async () => {
    const result = await api.ignoreItem(item);
    state.items = result.items;
    state.pinnedItems = result.pinnedItems;
    state.recentItems = result.recentItems;
    state.ignoredItems = result.ignoredItems;
    state.selectedIds.delete(item.id);
    setStatus(t("itemHidden"));
    render();
  }, true));
  positionContextMenu(event);
  menu.classList.remove("hidden");
}

function renderIgnoredItems() {
  if (!elements.ignoredList) return;
  const ignored = state.ignoredItems || [];
  elements.ignoredSummary.textContent = t("ignoredItems") + " " + ignored.length;
  elements.restoreAllIgnoredBtn.textContent = t("restoreAll");
  elements.restoreAllIgnoredBtn.disabled = ignored.length === 0;
  elements.ignoredList.innerHTML = "";
  if (!ignored.length) {
    const empty = document.createElement("div");
    empty.className = "ignored-row empty";
    empty.textContent = t("noIgnoredItems");
    elements.ignoredList.appendChild(empty);
    return;
  }
  for (const ignoredItem of ignored) {
    const row = document.createElement("div");
    row.className = "ignored-row";
    const label = document.createElement("span");
    label.textContent = ignoredItem.label || ignoredItem.key;
    const restore = document.createElement("button");
    restore.type = "button";
    restore.textContent = t("restore");
    restore.addEventListener("click", async () => {
      state.ignoredItems = await api.restoreIgnoredItem(ignoredItem.key);
      await scan();
    });
    row.append(label, restore);
    elements.ignoredList.appendChild(row);
  }
}

async function moveSelected() {
  const selected = Array.from(state.selectedIds);
  if (!selected.length) return;
  const moved = await moveItems(selected);
  if (moved) {
    state.selectedIds.clear();
    state.selectionMode = false;
    render();
  }
}

async function undoLastMove() {
  setStatus(t("undoing"));
  const result = await api.undoMove();
  if (!result) {
    setStatus(t("nothingToUndo"));
    return;
  }
  const restored = result.items.filter((item) => item.undoStatus === "restored").length;
  const failed = result.items.filter((item) => item.undoStatus === "failed").length;
  setStatus(failed ? restored + " " + t("restored") + ", " + failed + " " + t("failed") : restored + " " + t("restored"));
  await scan();
}

function resetCropControls() {
  elements.cropXInput.value = "0";
  elements.cropYInput.value = "0";
  elements.cropSizeInput.value = "100";
}

function cropCanvasSize(target = state.pendingSkinTarget) {
  if (target === "panel") {
    const expanded = state.settings && state.settings.expandedSize ? state.settings.expandedSize : { width: 380, height: 620 };
    const aspect = clamp(Number(expanded.width) / Math.max(1, Number(expanded.height)), 0.45, 1.2);
    const width = 280;
    const height = Math.round(width / aspect);
    return { width, height: clamp(height, 260, 440) };
  }
  return { width: 280, height: 280 };
}

function configureSkinModalForTarget() {
  const target = state.pendingSkinTarget || "handle";
  const size = cropCanvasSize(target);
  elements.skinCanvas.width = size.width;
  elements.skinCanvas.height = size.height;
  elements.skinCanvas.style.aspectRatio = size.width + " / " + size.height;
  elements.skinFinalPreview.classList.toggle("panel-preview", target === "panel");
  if (target === "panel") {
    const previewWidth = 64;
    elements.skinFinalPreview.style.width = previewWidth + "px";
    elements.skinFinalPreview.style.height = Math.round(previewWidth * size.height / size.width) + "px";
    elements.skinFinalPreview.style.flexBasis = previewWidth + "px";
  } else {
    elements.skinFinalPreview.style.width = "";
    elements.skinFinalPreview.style.height = "";
    elements.skinFinalPreview.style.flexBasis = "";
  }
  elements.cropTitle.textContent = t(target === "panel" ? "cropPanelSkin" : "cropButtonSkin");
  elements.saveSkinBtn.textContent = t(target === "panel" ? "savePanelSkin" : "saveSkin");
}

function cropGeometry(sizePercent = Number(elements.cropSizeInput.value) / 100) {
  const image = state.pendingSkinImage;
  if (!image) return null;
  const normalizedPercent = clamp(Number(sizePercent) || 1, 0.2, 1);
  const aspect = Math.max(0.05, elements.skinCanvas.width / Math.max(1, elements.skinCanvas.height));
  const imageAspect = image.naturalWidth / Math.max(1, image.naturalHeight);
  const maxCropWidth = imageAspect >= aspect ? image.naturalHeight * aspect : image.naturalWidth;
  const maxCropHeight = imageAspect >= aspect ? image.naturalHeight : image.naturalWidth / aspect;
  const cropWidth = maxCropWidth * normalizedPercent;
  const cropHeight = maxCropHeight * normalizedPercent;
  const maxX = Math.max(0, image.naturalWidth - cropWidth);
  const maxY = Math.max(0, image.naturalHeight - cropHeight);
  const sx = maxX * (Number(elements.cropXInput.value) / 100);
  const sy = maxY * (Number(elements.cropYInput.value) / 100);
  return { image, cropWidth, cropHeight, maxX, maxY, sx, sy };
}

function setCropSourcePosition(sx, sy, cropWidth, cropHeight) {
  const image = state.pendingSkinImage;
  if (!image) return;
  const maxX = Math.max(0, image.naturalWidth - cropWidth);
  const maxY = Math.max(0, image.naturalHeight - cropHeight);
  const nextX = maxX <= 0 ? 0 : clamp(sx, 0, maxX) / maxX * 100;
  const nextY = maxY <= 0 ? 0 : clamp(sy, 0, maxY) / maxY * 100;
  elements.cropXInput.value = String(Math.round(nextX * 10) / 10);
  elements.cropYInput.value = String(Math.round(nextY * 10) / 10);
}

function clearSkinPreview() {
  elements.skinFinalPreviewImage.removeAttribute("src");
  elements.skinFinalPreview.classList.remove("has-preview");
}

function updateSkinFinalPreview() {
  if (!state.pendingSkinImage || !state.pendingSkin) {
    clearSkinPreview();
    return;
  }
  const dataUrl = state.pendingSkin.isGif ? state.pendingSkin.dataUrl : elements.skinCanvas.toDataURL("image/png");
  elements.skinFinalPreviewImage.src = dataUrl;
  elements.skinFinalPreview.classList.add("has-preview");
}

function drawSkinCrop() {
  const canvas = elements.skinCanvas;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  const geometry = cropGeometry();
  if (!geometry) {
    clearSkinPreview();
    return;
  }
  context.drawImage(geometry.image, geometry.sx, geometry.sy, geometry.cropWidth, geometry.cropHeight, 0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(37, 99, 235, 0.95)";
  context.lineWidth = 3;
  context.strokeRect(1.5, 1.5, canvas.width - 3, canvas.height - 3);
  updateSkinFinalPreview();
}

function beginSkinCropDrag(event) {
  if (!state.pendingSkinImage) return;
  event.preventDefault();
  markInteracting(true);
  const geometry = cropGeometry();
  if (!geometry) return;
  state.cropDragging = true;
  state.cropDragStart = { x: event.clientX, y: event.clientY };
  state.cropDragOrigin = { sx: geometry.sx, sy: geometry.sy, cropWidth: geometry.cropWidth, cropHeight: geometry.cropHeight };
  elements.skinCanvas.classList.add("is-dragging");
  elements.skinCanvas.setPointerCapture(event.pointerId);
}

function updateSkinCropDrag(event) {
  if (!state.cropDragging || !state.pendingSkinImage) return;
  event.preventDefault();
  const rect = elements.skinCanvas.getBoundingClientRect();
  const scaleX = state.cropDragOrigin.cropWidth / Math.max(1, rect.width);
  const scaleY = state.cropDragOrigin.cropHeight / Math.max(1, rect.height);
  const dx = event.clientX - state.cropDragStart.x;
  const dy = event.clientY - state.cropDragStart.y;
  setCropSourcePosition(state.cropDragOrigin.sx - dx * scaleX, state.cropDragOrigin.sy - dy * scaleY, state.cropDragOrigin.cropWidth, state.cropDragOrigin.cropHeight);
  drawSkinCrop();
}

function endSkinCropDrag(event) {
  if (!state.cropDragging) return;
  state.cropDragging = false;
  elements.skinCanvas.classList.remove("is-dragging");
  try { elements.skinCanvas.releasePointerCapture(event.pointerId); } catch {}
  releaseInteractingSoon();
}

function zoomSkinCrop(event) {
  if (!state.pendingSkinImage) return;
  event.preventDefault();
  markInteracting(true);
  const geometry = cropGeometry();
  if (!geometry) return;
  const currentPercent = Number(elements.cropSizeInput.value) / 100;
  const nextPercent = clamp(currentPercent * (event.deltaY > 0 ? 1.08 : 0.92), 0.2, 1);
  const centerX = geometry.sx + geometry.cropWidth / 2;
  const centerY = geometry.sy + geometry.cropHeight / 2;
  const nextGeometry = cropGeometry(nextPercent);
  if (!nextGeometry) return;
  elements.cropSizeInput.value = String(Math.round(nextPercent * 1000) / 10);
  setCropSourcePosition(centerX - nextGeometry.cropWidth / 2, centerY - nextGeometry.cropHeight / 2, nextGeometry.cropWidth, nextGeometry.cropHeight);
  drawSkinCrop();
}

async function ensureVisiblePanelSkinOpacity() {
  if (!state.appearanceSettings || Number(state.appearanceSettings.panelOpacity) > 0.78) {
    state.appearanceSettings = await api.updateAppearance({ panelOpacity: 0.72 });
    applySettingsToControls();
  }
}

function openSkinCropModal(selected, target) {
  state.pendingSkinTarget = target;
  state.pendingSkin = selected;
  resetCropControls();
  configureSkinModalForTarget();
  const image = new Image();
  image.onload = () => {
    markInteracting(true);
    state.pendingSkinImage = image;
    elements.skinModal.classList.remove("hidden");
    drawSkinCrop();
  };
  image.onerror = async () => {
    setStatus(t("scanFailed"));
    await closeSkinModal();
  };
  image.src = selected.dataUrl;
}

async function openPanelSkinPicker() {
  window.clearTimeout(state.hideTimer);
  markInteracting(true);
  await api.setInteractionLock(true);
  await api.setExpanded(true);
  try {
    const selected = await api.selectPanelSkin();
    if (!selected) {
      await closeSkinModal();
      return;
    }
    if (selected.isGif) {
      state.skins = await api.savePanelSkin({ sourcePath: selected.sourcePath });
      await ensureVisiblePanelSkinOpacity();
      applySkin();
      setStatus(t("panelGifOriginal"));
      await api.setInteractionLock(false);
      releaseInteractingSoon();
      return;
    }
    openSkinCropModal(selected, "panel");
  } catch (error) {
    setStatus(error.message || t("scanFailed"));
    await closeSkinModal();
  }
}

async function resetPanelSkin() {
  try {
    state.skins = await api.resetPanelSkin();
    applySkin();
    setStatus(t("panelSkinResetDone"));
  } catch (error) {
    setStatus(error.message || t("scanFailed"));
  }
}

async function closeSkinModal() {
  elements.skinModal.classList.add("hidden");
  state.pendingSkin = null;
  state.pendingSkinImage = null;
  state.pendingSkinTarget = "handle";
  state.cropDragging = false;
  elements.skinCanvas.classList.remove("is-dragging");
  clearSkinPreview();
  await api.setInteractionLock(false);
  releaseInteractingSoon();
}

async function openSkinPicker() {
  window.clearTimeout(state.hideTimer);
  markInteracting(true);
  await api.setInteractionLock(true);
  await api.setExpanded(true);
  let selected;
  try {
    selected = await api.selectSkin();
  } catch (error) {
    setStatus(error.message || t("scanFailed"));
    await closeSkinModal();
    return;
  }
  if (!selected) {
    await closeSkinModal();
    return;
  }
  openSkinCropModal(selected, "handle");
}

async function saveSkin() {
  if (!state.pendingSkin) return;
  const target = state.pendingSkinTarget || "handle";
  const crop = {
    x: Number(elements.cropXInput.value),
    y: Number(elements.cropYInput.value),
    size: Number(elements.cropSizeInput.value)
  };
  try {
    if (target === "panel") {
      state.skins = await api.savePanelSkin({ dataUrl: elements.skinCanvas.toDataURL("image/png"), crop });
      await ensureVisiblePanelSkinOpacity();
      applySkin();
      setStatus(t("panelSkinUpdated"));
      await closeSkinModal();
      return;
    }

    if (state.pendingSkin.isGif) {
      state.skins = await api.saveSkin({ sourcePath: state.pendingSkin.sourcePath, crop });
    } else {
      state.skins = await api.saveSkin({ dataUrl: elements.skinCanvas.toDataURL("image/png"), crop });
    }
    applySkin();
    await closeSkinModal();
  } catch (error) {
    setStatus(error.message || t("scanFailed"));
  }
}

function bindEvents() {
  document.addEventListener("mouseenter", () => api.setPointerInside(true));
  document.addEventListener("mouseleave", schedulePointerLeave);
  document.addEventListener("focusin", () => markInteracting(true));
  document.addEventListener("focusout", releaseInteractingSoon);
  if (elements.panelScroll) {
    elements.panelScroll.addEventListener("scroll", keepScrollInteractionAlive, { passive: true });
    elements.panelScroll.addEventListener("wheel", keepScrollInteractionAlive, { passive: true });
  }
  document.querySelectorAll("details").forEach((details) => {
    details.addEventListener("toggle", () => {
      keepScrollInteractionAlive();
      if (details.open) window.setTimeout(() => details.scrollIntoView({ block: "nearest" }), 0);
    });
  });

  elements.dockHandle.addEventListener("click", (event) => {
    event.preventDefault();
    if (state.suppressHandleClick) {
      state.suppressHandleClick = false;
      return;
    }
    api.clickHandle();
  });

  elements.dockHandle.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    state.dragging = true;
    state.dragMoved = false;
    state.dragStart = { x: event.screenX, y: event.screenY };
    state.dragOffset = { x: event.clientX, y: event.clientY };
    markInteracting(true);
    elements.dockHandle.classList.add("is-dragging");
    elements.dockHandle.setPointerCapture(event.pointerId);
  });

  elements.dragHeader.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button, input, select")) return;
    event.preventDefault();
    state.dragging = true;
    state.dragMoved = false;
    state.dragStart = { x: event.screenX, y: event.screenY };
    state.dragOffset = { x: event.clientX, y: event.clientY };
    markInteracting(true);
    elements.dragHeader.setPointerCapture(event.pointerId);
  });

  document.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;
    const moved = Math.hypot(event.screenX - state.dragStart.x, event.screenY - state.dragStart.y);
    if (moved > 3) state.dragMoved = true;
    api.dragDock({ screenX: event.screenX, screenY: event.screenY, offsetX: state.dragOffset.x, offsetY: state.dragOffset.y });
  });

  document.addEventListener("pointerup", (event) => {
    if (!state.dragging) return;
    state.dragging = false;
    state.suppressHandleClick = state.dragMoved;
    elements.dockHandle.classList.remove("is-dragging");
    try { elements.dockHandle.releasePointerCapture(event.pointerId); } catch {}
    try { elements.dragHeader.releasePointerCapture(event.pointerId); } catch {}
    api.endDockDrag({ screenX: event.screenX, screenY: event.screenY });
    releaseInteractingSoon();
  });

  elements.scanBtn.addEventListener("click", scan);
  elements.hideBtn.addEventListener("click", () => api.setHidden(true));
  elements.desktopIconsQuickBtn.addEventListener("click", toggleDesktopIcons);
  elements.searchInput.addEventListener("compositionstart", () => {
    state.composing = true;
    markInteracting(true);
  });
  elements.searchInput.addEventListener("compositionend", () => {
    state.composing = false;
    state.query = elements.searchInput.value;
    api.updateSearch(state.query, state.activeCategoryId);
    renderShelves();
    renderItems();
    releaseInteractingSoon();
  });
  elements.searchInput.addEventListener("input", () => {
    if (state.composing) return;
    state.query = elements.searchInput.value;
    api.updateSearch(state.query, state.activeCategoryId);
    renderShelves();
    renderItems();
  });
  elements.allSearchBtn.addEventListener("click", () => {
    state.activeCategoryId = null;
    api.updateSearch(state.query, null);
    render();
  });
  elements.newCategoryBtn.addEventListener("click", async () => {
    const name = window.prompt(t("newCategoryName"));
    if (!name || !name.trim()) return;
    await api.createCategory(name.trim(), "#2563eb");
    await scan();
  });
  elements.selectVisibleBtn.addEventListener("click", () => {
    state.selectionMode = !state.selectionMode;
    state.selectedIds.clear();
    renderItems();
  });
  elements.moveBtn.addEventListener("click", moveSelected);
  elements.undoBtn.addEventListener("click", undoLastMove);
  elements.restoreAllIgnoredBtn.addEventListener("click", async () => {
    state.ignoredItems = await api.clearIgnoredItems();
    await scan();
  });
  document.addEventListener("click", (event) => {
    if (!elements.contextMenu.classList.contains("hidden") && !event.target.closest(".context-menu")) hideContextMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideContextMenu();
  });
  elements.addSourceBtn.addEventListener("click", async () => {
    const source = await api.addSource();
    if (source) {
      state.sources = await api.listSources();
      await scan();
    }
  });

  elements.languageSelect.addEventListener("change", () => updateAppearance({ language: elements.languageSelect.value }));
  elements.edgeSelect.addEventListener("change", () => updateSettings({ edge: elements.edgeSelect.value, positionMode: "edge" }));
  elements.opacityInput.addEventListener("input", () => updateSettings({ opacity: Number(elements.opacityInput.value) }));
  elements.panelBlurInput.addEventListener("input", () => updateAppearance({ panelBlurPx: Number(elements.panelBlurInput.value) }));
  elements.panelOpacityInput.addEventListener("input", () => updateAppearance({ panelOpacity: Number(elements.panelOpacityInput.value) }));
  elements.wakeRadiusInput.addEventListener("change", () => updateSettings({ wakeRadius: Number(elements.wakeRadiusInput.value) }));
  elements.hideRadiusInput.addEventListener("change", () => updateSettings({ hideRadius: Number(elements.hideRadiusInput.value) }));
  elements.animationInput.addEventListener("change", () => updateSettings({ animationMs: Number(elements.animationInput.value) }));
  elements.delayInput.addEventListener("change", () => updateSettings({ autoHideDelayMs: Number(elements.delayInput.value) }));
  elements.loginInput.addEventListener("change", () => updateSettings({ launchAtLogin: elements.loginInput.checked }));
  elements.desktopOnlyInput.addEventListener("change", () => updateSettings({ desktopOnlyMode: elements.desktopOnlyInput.checked }));
  elements.suppressMaximizedInput.addEventListener("change", () => updateSettings({ suppressOverMaximized: elements.suppressMaximizedInput.checked }));
  elements.hideIconsInput.addEventListener("change", () => updateDesktopSettings({ hideIconsAfterScan: elements.hideIconsInput.checked }));
  elements.restoreIconsInput.addEventListener("change", () => updateDesktopSettings({ restoreIconsOnQuit: elements.restoreIconsInput.checked }));
  elements.showDesktopIconsBtn.addEventListener("click", () => setDesktopIconsHidden(false));
  elements.hideDesktopIconsBtn.addEventListener("click", () => setDesktopIconsHidden(true));
  elements.panelSkinBtn.addEventListener("click", openPanelSkinPicker);
  elements.resetPanelSkinBtn.addEventListener("click", resetPanelSkin);
  elements.skinBtn.addEventListener("click", openSkinPicker);
  elements.resetSkinBtn.addEventListener("click", async () => {
    state.skins = await api.resetSkin();
    applySkin();
  });
  elements.closeSkinModalBtn.addEventListener("click", closeSkinModal);
  elements.cancelSkinBtn.addEventListener("click", closeSkinModal);
  elements.saveSkinBtn.addEventListener("click", saveSkin);
  elements.skinCanvas.addEventListener("pointerdown", beginSkinCropDrag);
  elements.skinCanvas.addEventListener("pointermove", updateSkinCropDrag);
  elements.skinCanvas.addEventListener("pointerup", endSkinCropDrag);
  elements.skinCanvas.addEventListener("pointercancel", endSkinCropDrag);
  elements.skinCanvas.addEventListener("wheel", zoomSkinCrop, { passive: false });
  for (const input of [elements.cropXInput, elements.cropYInput, elements.cropSizeInput]) {
    input.addEventListener("input", () => {
      markInteracting(true);
      drawSkinCrop();
    });
  }

  api.onDockState((dockState) => {
    state.settings = dockState.settings;
    state.desktopSettings = dockState.desktopSettings;
    state.appearanceSettings = dockState.appearanceSettings || state.appearanceSettings;
    state.skins = dockState.skins;
    state.dockMode = dockState.mode || (dockState.expanded ? "expanded" : "collapsed");
    elements.app.classList.toggle("expanded", state.dockMode === "expanded");
    elements.app.classList.toggle("collapsed", state.dockMode !== "expanded");
    elements.app.classList.toggle("mode-collapsed", state.dockMode === "collapsed");
    elements.app.classList.toggle("mode-peek", state.dockMode === "peek");
    elements.app.classList.toggle("mode-expanded", state.dockMode === "expanded");
    applyDockEdgeClass(dockState.edge || (state.settings && state.settings.edge));
    applySettingsToControls();
  });
  api.onScanRequest(scan);
}

async function init() {
  bindEvents();
  await loadSettings();
  await scan();
}

init();
