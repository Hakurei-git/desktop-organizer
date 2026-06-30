const test = require("node:test");
const assert = require("node:assert/strict");
const { displayLocation, redactPath } = require("../src/core/privacy");

test("redacts Windows user profile paths", () => {
  assert.equal(redactPath("C:\\Users\\Example\\Desktop\\App.lnk"), "~\\Desktop\\App.lnk");
});

test("redacts explicit home directory", () => {
  assert.equal(redactPath("/home/example/Desktop/App.desktop", "/home/example"), "~/Desktop/App.desktop");
});

test("display location avoids full paths", () => {
  assert.equal(
    displayLocation({ sourceLabel: "Desktop", name: "App.lnk", sourcePath: "C:\\Users\\Example\\Desktop\\App.lnk" }),
    "Desktop / App.lnk"
  );
});
