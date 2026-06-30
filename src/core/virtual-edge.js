function distanceToAreaEdges(area, point) {
  return [
    { edge: "left", value: Math.abs(point.x - area.x) },
    { edge: "right", value: Math.abs(point.x - (area.x + area.width)) },
    { edge: "top", value: Math.abs(point.y - area.y) },
    { edge: "bottom", value: Math.abs(point.y - (area.y + area.height)) }
  ].sort((a, b) => a.value - b.value)[0];
}

function virtualAreaFromAreas(areas) {
  const left = Math.min(...areas.map((area) => area.x));
  const top = Math.min(...areas.map((area) => area.y));
  const right = Math.max(...areas.map((area) => area.x + area.width));
  const bottom = Math.max(...areas.map((area) => area.y + area.height));
  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top
  };
}

function nearestVirtualEdgeFromAreas(areas, point) {
  return distanceToAreaEdges(virtualAreaFromAreas(areas), point);
}

module.exports = {
  distanceToAreaEdges,
  virtualAreaFromAreas,
  nearestVirtualEdgeFromAreas
};
