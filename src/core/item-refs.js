const path = require("node:path");

function normalizePathKey(filePath) {
  const value = String(filePath || "").trim();
  if (!value) return "";
  const normalized = path.normalize(value);
  return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}

function itemKey(item = {}) {
  const source = normalizePathKey(item.sourcePath);
  const target = normalizePathKey(item.targetPath);
  if (source && target && source !== target) {
    return source + "|" + target;
  }
  return source || target || String(item.key || item.id || item.name || "").trim().toLowerCase();
}

function itemRef(item = {}) {
  return {
    key: itemKey(item),
    id: item.id || null,
    name: item.name || "",
    kind: item.kind || "file",
    sourcePath: item.sourcePath || null,
    targetPath: item.targetPath || null,
    sourceLabel: item.sourceLabel || "",
    categoryId: item.categoryId || "other",
    pinnedAt: item.pinnedAt || null,
    openedAt: item.openedAt || null
  };
}

function isDefaultIgnoredItem(item = {}) {
  return String(item.name || "").toLowerCase() === "desktop.ini";
}

function filterIgnoredItems(items = [], ignoredItemKeys = []) {
  const ignored = new Set(ignoredItemKeys);
  return items.filter((item) => {
    const key = itemKey(item);
    return key && !ignored.has(key) && !isDefaultIgnoredItem(item);
  });
}

function mergeItemRefs(refs = [], currentItems = []) {
  const currentByKey = new Map(currentItems.map((item) => [itemKey(item), item]));
  return refs
    .map((ref) => {
      const key = ref?.key || itemKey(ref);
      const current = currentByKey.get(key);
      return itemRef({ ...(ref || {}), ...(current || {}), key });
    })
    .filter((ref) => ref.key);
}

module.exports = {
  normalizePathKey,
  itemKey,
  itemRef,
  isDefaultIgnoredItem,
  filterIgnoredItems,
  mergeItemRefs
};
