const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { itemKey, itemRef, filterIgnoredItems, mergeItemRefs, normalizePathKey } = require("../src/core/item-refs");

test("creates stable item keys from paths and shortcut targets", () => {
  const sourcePath = path.join("C:", "Temp", "Code.lnk");
  const targetPath = path.join("C:", "Temp", "Code.exe");
  const key = itemKey({ sourcePath, targetPath });

  assert.equal(key, normalizePathKey(sourcePath) + "|" + normalizePathKey(targetPath));
  if (process.platform === "win32") {
    assert.equal(normalizePathKey(sourcePath.toUpperCase()), normalizePathKey(sourcePath.toLowerCase()));
  }
});

test("filters explicit and default ignored items", () => {
  const visible = { name: "Report.pdf", sourcePath: path.join("tmp", "Report.pdf") };
  const ignored = { name: "Hidden.txt", sourcePath: path.join("tmp", "Hidden.txt") };
  const desktopIni = { name: "desktop.ini", sourcePath: path.join("tmp", "desktop.ini") };

  assert.deepEqual(
    filterIgnoredItems([visible, ignored, desktopIni], [itemKey(ignored)]).map((item) => item.name),
    ["Report.pdf"]
  );
});

test("merges saved item refs with current scan items", () => {
  const saved = itemRef({ name: "Old", sourcePath: path.join("tmp", "app.lnk"), categoryId: "other" });
  const current = { name: "New", sourcePath: path.join("tmp", "app.lnk"), categoryId: "applications", sourceLabel: "Desktop" };
  const [merged] = mergeItemRefs([saved], [current]);

  assert.equal(merged.name, "New");
  assert.equal(merged.categoryId, "applications");
});
