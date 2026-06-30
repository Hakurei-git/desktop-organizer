const test = require("node:test");
const assert = require("node:assert/strict");
const { classifyItem } = require("../src/core/classifier");

test("classifies document extensions", () => {
  const result = classifyItem({
    name: "quarterly-report.pdf",
    kind: "file",
    sourcePath: "C:\\Users\\me\\Desktop\\quarterly-report.pdf"
  });

  assert.equal(result.categoryId, "documents");
  assert.equal(result.confidence > 0.9, true);
});

test("classifies image extensions", () => {
  const result = classifyItem({
    name: "screenshot.png",
    kind: "file",
    sourcePath: "/Users/me/Desktop/screenshot.png"
  });

  assert.equal(result.categoryId, "images");
});

test("classifies game shortcuts by keyword before application fallback", () => {
  const result = classifyItem({
    name: "Steam.lnk",
    kind: "shortcut",
    sourcePath: "C:\\Users\\me\\Desktop\\Steam.lnk"
  });

  assert.equal(result.categoryId, "games");
});

test("classifies development tools by keyword", () => {
  const result = classifyItem({
    name: "Visual Studio Code.lnk",
    kind: "shortcut",
    sourcePath: "C:\\Users\\me\\Desktop\\Visual Studio Code.lnk"
  });

  assert.equal(result.categoryId, "development");
});

test("falls back to other when no rule matches", () => {
  const result = classifyItem({
    name: "unknown.blob",
    kind: "file",
    sourcePath: "/tmp/unknown.blob"
  });

  assert.equal(result.categoryId, "other");
});
