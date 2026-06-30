function isUsableIconDataUrl(dataUrl) {
  if (typeof dataUrl !== "string") {
    return false;
  }
  if (!dataUrl.startsWith("data:image/")) {
    return false;
  }
  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex === -1) {
    return false;
  }
  return dataUrl.length - commaIndex > 160;
}

module.exports = {
  isUsableIconDataUrl
};
