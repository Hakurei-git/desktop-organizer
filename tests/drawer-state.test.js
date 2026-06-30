const test = require("node:test");
const assert = require("node:assert/strict");
const { nextDrawerState } = require("../src/core/drawer-state");

test("drawer requires a handle click before full expansion", () => {
  const peek = nextDrawerState("collapsed", { type: "pointerNear" });
  assert.equal(peek, "peek");

  const expanded = nextDrawerState(peek, { type: "handleClick" });
  assert.equal(expanded, "expanded");

  const collapsed = nextDrawerState(expanded, { type: "pointerFar" });
  assert.equal(collapsed, "collapsed");
});

test("drawer does not collapse while user is interacting", () => {
  assert.equal(nextDrawerState("expanded", { type: "pointerFar", interacting: true }), "expanded");
  assert.equal(nextDrawerState("peek", { type: "collapse", interacting: true }), "peek");
});
