const path = require("node:path");

function displayLocation(item) {
  const source = item?.sourceLabel || "Source";
  const name = item?.name || path.basename(item?.sourcePath || "");
  return `${source} / ${name}`;
}

function redactPath(filePath, homeDir = "") {
  if (!filePath) {
    return "";
  }

  const normalized = String(filePath);
  if (homeDir && normalized.toLowerCase().startsWith(String(homeDir).toLowerCase())) {
    return normalized.replace(homeDir, "~");
  }
  return normalized.replace(/^[A-Za-z]:\\Users\\[^\\]+/i, "~");
}

module.exports = {
  displayLocation,
  redactPath
};
