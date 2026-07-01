const fs = require("node:fs");
const path = require("node:path");
const { makeCustomCategory } = require("./catalog");
const { itemKey, itemRef } = require("./item-refs");
const { defaultDestinationRoot } = require("./mover");

const DEFAULT_SETTINGS = {
  edge: "right",
  x: null,
  y: 180,
  opacity: 0.94,
  collapsedSize: 48,
  expandedSize: {
    width: 380,
    height: 620
  },
  autoHideDelayMs: 480,
  wakeRadius: 96,
  hideRadius: 220,
  animationMs: 180,
  peekSize: 7,
  peekWidth: 48,
  clickToExpand: true,
  suppressOverMaximized: true,
  allowCoverFullscreen: false,
  positionMode: "edge",
  desktopOnlyMode: false,
  launchAtLogin: false,
  hiddenByUser: false,
  destinationRoot: defaultDestinationRoot()
};

const DEFAULT_DESKTOP_SETTINGS = {
  hideIconsAfterScan: true,
  restoreIconsOnQuit: true,
  iconsHidden: false
};

const DEFAULT_SKINS = {
  handleSkinPath: null,
  handleSkinType: null,
  handleSkinDataUrl: null,
  panelSkinPath: null,
  panelSkinType: null,
  panelSkinDataUrl: null,
  panelCrop: null,
  crop: null
};

const DEFAULT_APPEARANCE_SETTINGS = {
  language: "zh-CN",
  panelBlurPx: 18,
  panelOpacity: 0.96
};

function defaultState() {
  return {
    version: 4,
    sources: [],
    categories: [],
    items: [],
    lastScan: null,
    moveHistory: [],
    dockSettings: { ...DEFAULT_SETTINGS },
    desktopSettings: { ...DEFAULT_DESKTOP_SETTINGS },
    appearanceSettings: { ...DEFAULT_APPEARANCE_SETTINGS },
    skins: { ...DEFAULT_SKINS },
    customCategories: [],
    manualAssignments: {},
    pinnedItems: [],
    recentItems: [],
    ignoredItemKeys: [],
    iconCache: {}
  };
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function createStore(userDataPath) {
  ensureDir(userDataPath);
  const filePath = path.join(userDataPath, "organizer-store.json");
  let state = defaultState();

  function load() {
    if (!fs.existsSync(filePath)) {
      save();
      return state;
    }

    try {
      const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
      state = {
        ...defaultState(),
        ...parsed,
        dockSettings: {
          ...DEFAULT_SETTINGS,
          ...(parsed.dockSettings || {})
        },
        desktopSettings: {
          ...DEFAULT_DESKTOP_SETTINGS,
          ...(parsed.desktopSettings || {})
        },
        appearanceSettings: {
          ...DEFAULT_APPEARANCE_SETTINGS,
          ...(parsed.appearanceSettings || {})
        },
        skins: {
          ...DEFAULT_SKINS,
          ...(parsed.skins || {})
        },
        sources: Array.isArray(parsed.sources) ? parsed.sources : [],
        moveHistory: Array.isArray(parsed.moveHistory) ? parsed.moveHistory : [],
        customCategories: Array.isArray(parsed.customCategories) ? parsed.customCategories : [],
        manualAssignments: parsed.manualAssignments && typeof parsed.manualAssignments === "object" ? parsed.manualAssignments : {},
        pinnedItems: Array.isArray(parsed.pinnedItems) ? parsed.pinnedItems.filter((item) => item?.key) : [],
        recentItems: Array.isArray(parsed.recentItems) ? parsed.recentItems.filter((item) => item?.key) : [],
        ignoredItemKeys: Array.isArray(parsed.ignoredItemKeys) ? [...new Set(parsed.ignoredItemKeys.filter(Boolean))] : [],
        iconCache: parsed.iconCache && typeof parsed.iconCache === "object" ? parsed.iconCache : {}
      };

      if (Number(parsed.version || 0) < 3) {
        if (Number(state.dockSettings.peekSize) === 12) state.dockSettings.peekSize = DEFAULT_SETTINGS.peekSize;
        if (Number(state.dockSettings.peekWidth) === 54) state.dockSettings.peekWidth = DEFAULT_SETTINGS.peekWidth;
        state.version = 4;
        save();
      } else if (Number(parsed.version || 0) < 4) {
        state.version = 4;
        save();
      }
    } catch {
      const backupPath = filePath + ".broken-" + Date.now();
      fs.copyFileSync(filePath, backupPath);
      state = defaultState();
      save();
    }
    return state;
  }

  function save() {
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf8");
  }

  function getState() {
    return state;
  }

  function update(patch) {
    state = {
      ...state,
      ...patch,
      dockSettings: {
        ...state.dockSettings,
        ...(patch.dockSettings || {})
      },
      desktopSettings: {
        ...state.desktopSettings,
        ...(patch.desktopSettings || {})
      },
      appearanceSettings: {
        ...state.appearanceSettings,
        ...(patch.appearanceSettings || {})
      },
      skins: {
        ...state.skins,
        ...(patch.skins || {})
      }
    };
    save();
    return state;
  }

  function updateSettings(settingsPatch) {
    return update({
      dockSettings: {
        ...state.dockSettings,
        ...settingsPatch
      }
    }).dockSettings;
  }

  function updateDesktopSettings(settingsPatch) {
    return update({
      desktopSettings: {
        ...state.desktopSettings,
        ...settingsPatch
      }
    }).desktopSettings;
  }

  function updateAppearanceSettings(settingsPatch) {
    return update({
      appearanceSettings: {
        ...state.appearanceSettings,
        ...settingsPatch
      }
    }).appearanceSettings;
  }

  function updateSkins(skinsPatch) {
    return update({
      skins: {
        ...state.skins,
        ...skinsPatch
      }
    }).skins;
  }

  function addSource(sourcePath) {
    const normalizedPath = path.resolve(sourcePath);
    const existing = state.sources.find((source) => path.resolve(source.path) === normalizedPath);
    if (existing) {
      return existing;
    }

    const source = {
      id: "custom-" + Date.now(),
      label: path.basename(normalizedPath) || normalizedPath,
      path: normalizedPath,
      type: "custom",
      depth: 0,
      movable: true
    };

    state.sources = [...state.sources, source];
    save();
    return source;
  }

  function removeSource(sourceId) {
    state.sources = state.sources.filter((source) => source.id !== sourceId);
    save();
    return state.sources;
  }

  function createCustomCategory(name, accent) {
    const category = makeCustomCategory(name, accent);
    state.customCategories = [...state.customCategories, category];
    save();
    return category;
  }

  function updateCustomCategory(categoryId, patch) {
    state.customCategories = state.customCategories.map((category) => {
      if (category.id !== categoryId) {
        return category;
      }
      const nextName = patch.name !== undefined ? String(patch.name).trim().slice(0, 36) : category.name;
      return {
        ...category,
        ...patch,
        id: category.id,
        custom: true,
        name: nextName || category.name
      };
    });
    save();
    return state.customCategories.find((category) => category.id === categoryId) || null;
  }

  function deleteCustomCategory(categoryId) {
    state.customCategories = state.customCategories.filter((category) => category.id !== categoryId);
    for (const [itemId, assignedCategoryId] of Object.entries(state.manualAssignments)) {
      if (assignedCategoryId === categoryId) {
        delete state.manualAssignments[itemId];
      }
    }
    save();
    return state.customCategories;
  }

  function assignItemCategory(itemId, categoryId) {
    if (!itemId || !categoryId) {
      throw new Error("Item and category are required.");
    }
    state.manualAssignments = {
      ...state.manualAssignments,
      [itemId]: categoryId
    };
    save();
    return state.manualAssignments;
  }

  function pinItem(item) {
    const ref = itemRef(item);
    if (!ref.key) {
      throw new Error("Item key is required.");
    }
    const pinnedAt = new Date().toISOString();
    state.pinnedItems = [
      { ...ref, pinnedAt },
      ...state.pinnedItems.filter((candidate) => candidate.key !== ref.key)
    ].slice(0, 12);
    save();
    return state.pinnedItems;
  }

  function unpinItem(itemOrKey) {
    const key = typeof itemOrKey === "string" ? itemOrKey : itemKey(itemOrKey);
    state.pinnedItems = state.pinnedItems.filter((candidate) => candidate.key !== key);
    save();
    return state.pinnedItems;
  }

  function addRecentItem(item) {
    const ref = itemRef(item);
    if (!ref.key) {
      return state.recentItems;
    }
    const openedAt = new Date().toISOString();
    state.recentItems = [
      { ...ref, openedAt },
      ...state.recentItems.filter((candidate) => candidate.key !== ref.key)
    ].slice(0, 20);
    save();
    return state.recentItems;
  }

  function clearRecentItems() {
    state.recentItems = [];
    save();
    return state.recentItems;
  }

  function ignoreItem(item) {
    const key = itemKey(item);
    if (!key) {
      throw new Error("Item key is required.");
    }
    state.ignoredItemKeys = [...new Set([key, ...state.ignoredItemKeys])];
    state.pinnedItems = state.pinnedItems.filter((candidate) => candidate.key !== key);
    state.recentItems = state.recentItems.filter((candidate) => candidate.key !== key);
    save();
    return state.ignoredItemKeys;
  }

  function restoreIgnoredItem(key) {
    state.ignoredItemKeys = state.ignoredItemKeys.filter((candidate) => candidate !== key);
    save();
    return state.ignoredItemKeys;
  }

  function clearIgnoredItems() {
    state.ignoredItemKeys = [];
    save();
    return state.ignoredItemKeys;
  }

  function addMoveHistory(historyEntry) {
    state.moveHistory = [historyEntry, ...state.moveHistory].slice(0, 20);
    save();
    return state.moveHistory;
  }

  function popLastMoveHistory() {
    const [lastMove, ...rest] = state.moveHistory;
    state.moveHistory = rest;
    save();
    return lastMove || null;
  }

  function getIconCache(key) {
    return state.iconCache[key] || null;
  }

  function setIconCache(key, value) {
    const entries = Object.entries({ ...state.iconCache, [key]: value }).slice(-500);
    state.iconCache = Object.fromEntries(entries);
    save();
    return value;
  }

  load();

  return {
    filePath,
    userDataPath,
    getState,
    update,
    updateSettings,
    updateDesktopSettings,
    updateAppearanceSettings,
    updateSkins,
    addSource,
    removeSource,
    createCustomCategory,
    updateCustomCategory,
    deleteCustomCategory,
    assignItemCategory,
    pinItem,
    unpinItem,
    addRecentItem,
    clearRecentItems,
    ignoreItem,
    restoreIgnoredItem,
    clearIgnoredItems,
    addMoveHistory,
    popLastMoveHistory,
    getIconCache,
    setIconCache
  };
}

module.exports = {
  DEFAULT_SETTINGS,
  DEFAULT_DESKTOP_SETTINGS,
  DEFAULT_APPEARANCE_SETTINGS,
  DEFAULT_SKINS,
  createStore
};
