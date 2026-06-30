const test = require("node:test");
const assert = require("node:assert/strict");
const { makeCustomCategory, mergeCategories, applyManualAssignments, searchItems } = require("../src/core/catalog");

test("manual assignments override automatic categories", () => {
  const item = {
    id: "item-1",
    name: "Steam.lnk",
    categoryId: "games",
    confidence: 0.9,
    reason: "Matched game keyword."
  };

  const [assigned] = applyManualAssignments([item], { "item-1": "development" });

  assert.equal(assigned.categoryId, "development");
  assert.equal(assigned.manualCategory, true);
  assert.equal(assigned.confidence, 1);
});

test("search filters within a category when active category is set", () => {
  const items = [
    { id: "1", name: "Visual Studio Code", categoryId: "development", sourceLabel: "Desktop" },
    { id: "2", name: "Code Notes.pdf", categoryId: "documents", sourceLabel: "Desktop" },
    { id: "3", name: "Steam", categoryId: "games", sourceLabel: "Start Menu" }
  ];

  assert.deepEqual(
    searchItems(items, "code", "development").map((item) => item.id),
    ["1"]
  );
  assert.deepEqual(
    searchItems(items, "code", null).map((item) => item.id),
    ["1", "2"]
  );
});

test("custom categories merge after default categories", () => {
  const custom = makeCustomCategory("Pinned Apps", "#123456");
  const categories = mergeCategories([custom]);

  assert.equal(categories.at(-1).name, "Pinned Apps");
  assert.equal(categories.at(-1).custom, true);
});
