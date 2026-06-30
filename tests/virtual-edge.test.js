const test = require("node:test");
const assert = require("node:assert/strict");
const { nearestVirtualEdgeFromAreas, virtualAreaFromAreas } = require("../src/core/virtual-edge");

test("virtual area combines adjacent displays into one outer desktop", () => {
  const areas = [
    { x: 0, y: 0, width: 1920, height: 1080 },
    { x: 1920, y: 0, width: 1920, height: 1080 }
  ];

  assert.deepEqual(virtualAreaFromAreas(areas), { x: 0, y: 0, width: 3840, height: 1080 });
});

test("nearest virtual edge ignores the seam between two displays", () => {
  const areas = [
    { x: 0, y: 0, width: 1920, height: 1080 },
    { x: 1920, y: 0, width: 1920, height: 1080 }
  ];

  const edge = nearestVirtualEdgeFromAreas(areas, { x: 1919, y: 540 });

  assert.notEqual(edge.edge, "right");
  assert.equal(edge.value, 540);
});
