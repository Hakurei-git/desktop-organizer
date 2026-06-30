const DRAWER_STATES = {
  collapsed: "collapsed",
  peek: "peek",
  expanded: "expanded"
};

function nextDrawerState(currentState, event) {
  const state = DRAWER_STATES[currentState] || DRAWER_STATES.collapsed;
  const type = event?.type;

  if (event?.interacting && (type === "pointerFar" || type === "collapse")) {
    return state;
  }

  if (type === "hide") {
    return DRAWER_STATES.collapsed;
  }

  if (type === "pointerNear") {
    return state === DRAWER_STATES.expanded ? DRAWER_STATES.expanded : DRAWER_STATES.peek;
  }

  if (type === "handleClick" || type === "expand") {
    return DRAWER_STATES.expanded;
  }

  if (type === "pointerFar" || type === "collapse") {
    return DRAWER_STATES.collapsed;
  }

  return state;
}

module.exports = {
  DRAWER_STATES,
  nextDrawerState
};
