const test = require("node:test");
const assert = require("node:assert/strict");
const { isUsableIconDataUrl } = require("../src/core/icon-fallback");

test("rejects empty or tiny icon data urls", () => {
  assert.equal(isUsableIconDataUrl(null), false);
  assert.equal(isUsableIconDataUrl("data:image/png;base64,"), false);
  assert.equal(isUsableIconDataUrl("data:image/png;base64,AA=="), false);
});

test("accepts plausible icon data urls", () => {
  const payload = Buffer.alloc(180, 1).toString("base64");
  assert.equal(isUsableIconDataUrl("data:image/png;base64," + payload), true);
});
