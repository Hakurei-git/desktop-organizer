const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeLanguage, translate } = require("../src/core/i18n");

test("normalizes supported app languages", () => {
  assert.equal(normalizeLanguage("zh-Hans-CN"), "zh-CN");
  assert.equal(normalizeLanguage("en-GB"), "en-US");
  assert.equal(normalizeLanguage("fr-FR"), "en-US");
  assert.equal(normalizeLanguage(""), "zh-CN");
});

test("translates with English fallback", () => {
  assert.equal(translate("zh-CN", "scan"), "扫描");
  assert.equal(translate("en-US", "scan"), "Scan");
  assert.equal(translate("zh-CN", "missing-key"), "missing-key");
});
