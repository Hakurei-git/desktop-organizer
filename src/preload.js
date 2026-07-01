const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("organizer", {
  scanSources: () => ipcRenderer.invoke("scan:sources"),
  listSources: () => ipcRenderer.invoke("sources:list"),
  addSource: (sourcePath) => ipcRenderer.invoke("sources:add", sourcePath),
  removeSource: (sourceId) => ipcRenderer.invoke("sources:remove", sourceId),
  previewMove: (itemIds) => ipcRenderer.invoke("move:preview", itemIds),
  applyMove: (plan) => ipcRenderer.invoke("move:apply", plan),
  undoMove: () => ipcRenderer.invoke("move:undo"),
  getSettings: () => ipcRenderer.invoke("settings:get"),
  updateSettings: (patch) => ipcRenderer.invoke("settings:update", patch),
  getDesktopSettings: () => ipcRenderer.invoke("desktopSettings:get"),
  getAppearance: () => ipcRenderer.invoke("appearance:get"),
  updateAppearance: (patch) => ipcRenderer.invoke("appearance:update", patch),
  updateDesktopSettings: (patch) => ipcRenderer.invoke("desktopSettings:update", patch),
  getDesktopIcons: () => ipcRenderer.invoke("desktopIcons:get"),
  setDesktopIcons: (hidden) => ipcRenderer.invoke("desktopIcons:set", hidden),
  getSkin: () => ipcRenderer.invoke("skin:get"),
  selectSkin: () => ipcRenderer.invoke("skin:select"),
  saveSkin: (payload) => ipcRenderer.invoke("skin:save", payload),
  resetSkin: () => ipcRenderer.invoke("skin:reset"),
  selectPanelSkin: () => ipcRenderer.invoke("skin:selectPanel"),
  savePanelSkin: (payload) => ipcRenderer.invoke("skin:savePanel", payload),
  resetPanelSkin: () => ipcRenderer.invoke("skin:resetPanel"),
  listCategories: () => ipcRenderer.invoke("categories:list"),
  createCategory: (name, accent) => ipcRenderer.invoke("categories:create", name, accent),
  updateCategory: (categoryId, patch) => ipcRenderer.invoke("categories:update", categoryId, patch),
  deleteCategory: (categoryId) => ipcRenderer.invoke("categories:delete", categoryId),
  assignItemCategory: (itemId, categoryId) => ipcRenderer.invoke("categories:assignItem", itemId, categoryId),
  pinItem: (item) => ipcRenderer.invoke("items:pin", item),
  unpinItem: (itemOrKey) => ipcRenderer.invoke("items:unpin", itemOrKey),
  listPinnedItems: () => ipcRenderer.invoke("items:pinned:list"),
  listRecentItems: () => ipcRenderer.invoke("items:recent:list"),
  clearRecentItems: () => ipcRenderer.invoke("items:recent:clear"),
  ignoreItem: (item) => ipcRenderer.invoke("items:ignore", item),
  listIgnoredItems: () => ipcRenderer.invoke("items:ignored:list"),
  restoreIgnoredItem: (key) => ipcRenderer.invoke("items:ignore:restore", key),
  clearIgnoredItems: () => ipcRenderer.invoke("items:ignore:clear"),
  updateSearch: (query, activeCategoryId) => ipcRenderer.invoke("search:update", query, activeCategoryId),
  getItemIcon: (item) => ipcRenderer.invoke("icons:getItemIcon", item),
  launchItem: (item) => ipcRenderer.invoke("app:launchItem", item),
  revealItem: (item) => ipcRenderer.invoke("app:revealItem", item),
  redactPath: (filePath) => ipcRenderer.invoke("app:redactPath", filePath),
  copyPath: (item) => ipcRenderer.invoke("app:copyPath", item),
  getPointerState: () => ipcRenderer.invoke("dock:getPointerState"),
  updateHotspotSettings: (patch) => ipcRenderer.invoke("dock:updateHotspotSettings", patch),
  setPeekVisible: (visible) => ipcRenderer.invoke("dock:setPeekVisible", visible),
  clickHandle: () => ipcRenderer.invoke("dock:clickHandle"),
  getForegroundState: () => ipcRenderer.invoke("window:getForegroundState"),
  setExpanded: (expanded) => ipcRenderer.invoke("dock:setExpanded", expanded),
  setHidden: (hidden) => ipcRenderer.invoke("dock:setHidden", hidden),
  setPointerInside: (inside) => ipcRenderer.invoke("dock:setPointerInside", inside),
  setInteractionLock: (locked) => ipcRenderer.invoke("dock:setInteractionLock", locked),
  dragDock: (point) => ipcRenderer.invoke("dock:drag", point),
  endDockDrag: (point) => ipcRenderer.invoke("dock:endDrag", point),
  onDockState: (callback) => {
    const listener = (_event, state) => callback(state);
    ipcRenderer.on("dock:state", listener);
    return () => ipcRenderer.removeListener("dock:state", listener);
  },
  onScanRequest: (callback) => {
    const listener = () => callback();
    ipcRenderer.on("scan:request", listener);
    return () => ipcRenderer.removeListener("scan:request", listener);
  },
  onSearchUpdated: (callback) => {
    const listener = (_event, state) => callback(state);
    ipcRenderer.on("search:updated", listener);
    return () => ipcRenderer.removeListener("search:updated", listener);
  }
});
