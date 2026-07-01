const test = require("node:test");
const assert = require("node:assert/strict");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { createStore } = require("../src/core/store");
const { itemKey } = require("../src/core/item-refs");

async function tempStore() {
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), "desktop-organizer-store-"));
  return createStore(dir);
}

test("persists custom category CRUD and manual assignments", async () => {
  const store = await tempStore();
  const category = store.createCustomCategory("Work", "#0f766e");
  assert.equal(category.name, "Work");

  const renamed = store.updateCustomCategory(category.id, { name: "Pinned" });
  assert.equal(renamed.name, "Pinned");

  const assignments = store.assignItemCategory("item-1", category.id);
  assert.equal(assignments["item-1"], category.id);

  store.deleteCustomCategory(category.id);
  assert.equal(store.getState().manualAssignments["item-1"], undefined);
});

test("persists dock, desktop, skin, and icon cache settings", async () => {
  const store = await tempStore();
  store.updateSettings({ wakeRadius: 144, animationMs: 260, desktopOnlyMode: true });
  store.updateDesktopSettings({ hideIconsAfterScan: false, iconsHidden: true });
  store.updateSkins({ handleSkinDataUrl: "data:image/png;base64,AA==", panelSkinDataUrl: "data:image/png;base64,CC==", panelCrop: { x: 12, y: 20, size: 80 } });
  store.updateAppearanceSettings({ language: "en-US", panelBlurPx: 12, panelOpacity: 0.88 });
  store.setIconCache("item:icon", "data:image/png;base64,BB==");

  assert.equal(store.getState().dockSettings.wakeRadius, 144);
  assert.equal(store.getState().dockSettings.desktopOnlyMode, true);
  assert.equal(store.getState().desktopSettings.hideIconsAfterScan, false);
  assert.equal(store.getState().skins.handleSkinDataUrl, "data:image/png;base64,AA==");
  assert.equal(store.getState().skins.panelSkinDataUrl, "data:image/png;base64,CC==");
  assert.deepEqual(store.getState().skins.panelCrop, { x: 12, y: 20, size: 80 });
  assert.equal(store.getState().appearanceSettings.language, "en-US");
  assert.equal(store.getState().appearanceSettings.panelBlurPx, 12);
  assert.equal(store.getState().appearanceSettings.panelOpacity, 0.88);
  assert.equal(store.getIconCache("item:icon"), "data:image/png;base64,BB==");
});

test("migrates legacy drawer handle defaults", async () => {
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), "desktop-organizer-store-"));
  await fsp.writeFile(path.join(dir, "organizer-store.json"), JSON.stringify({
    version: 2,
    dockSettings: { peekSize: 12, peekWidth: 54 }
  }), "utf8");

  const store = createStore(dir);

  assert.equal(store.getState().version, 4);
  assert.equal(store.getState().dockSettings.peekSize, 7);
  assert.equal(store.getState().dockSettings.peekWidth, 48);
});


test("persists pinned, recent, and ignored item state", async () => {
  const store = await tempStore();
  const item = {
    id: "item-1",
    name: "Visual Studio Code.lnk",
    kind: "shortcut",
    sourcePath: path.join(os.tmpdir(), "Code.lnk"),
    targetPath: path.join(os.tmpdir(), "Code.exe"),
    sourceLabel: "Desktop",
    categoryId: "development"
  };

  store.pinItem(item);
  store.pinItem(item);
  assert.equal(store.getState().pinnedItems.length, 1);

  for (let index = 0; index < 22; index += 1) {
    store.addRecentItem({ ...item, sourcePath: path.join(os.tmpdir(), "app-" + index + ".lnk") });
  }
  assert.equal(store.getState().recentItems.length, 20);

  store.addRecentItem(item);
  assert.equal(store.getState().recentItems[0].name, "Visual Studio Code.lnk");

  store.ignoreItem(item);
  assert.equal(store.getState().ignoredItemKeys.includes(store.getState().recentItems[0]?.key), false);
  assert.equal(store.getState().pinnedItems.length, 0);

  const [ignoredKey] = store.getState().ignoredItemKeys;
  store.restoreIgnoredItem(ignoredKey);
  assert.equal(store.getState().ignoredItemKeys.length, 0);
});
