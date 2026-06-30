const path = require("node:path");
const { DEFAULT_CATEGORIES, getCategory } = require("./categories");

const SHORTCUT_EXTENSIONS = new Set([".lnk", ".url", ".desktop", ".appref-ms"]);
const INSTALLER_EXTENSIONS = new Set([".exe", ".msi", ".pkg", ".deb", ".rpm"]);

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getExtension(item) {
  const candidates = [item.targetPath, item.sourcePath, item.name];
  for (const candidate of candidates) {
    const ext = path.extname(String(candidate || "")).toLowerCase();
    if (ext) {
      return ext;
    }
  }
  return "";
}

function matchKeyword(category, haystack) {
  return category.keywords.find((keyword) => haystack.includes(keyword));
}

function classifyItem(item) {
  const name = item.name || path.basename(item.sourcePath || "");
  const ext = getExtension(item);
  const haystack = normalizeText(`${name} ${item.sourcePath || ""} ${item.targetPath || ""}`);
  const isFolder = item.kind === "folder";
  const isShortcut = item.kind === "shortcut" || SHORTCUT_EXTENSIONS.has(ext);

  const gameKeyword = matchKeyword(getCategory("games"), haystack);
  if (gameKeyword) {
    return {
      categoryId: "games",
      confidence: isShortcut ? 0.91 : 0.84,
      reason: `Matched game keyword "${gameKeyword}".`
    };
  }

  const devKeyword = matchKeyword(getCategory("development"), haystack);
  if (devKeyword) {
    return {
      categoryId: "development",
      confidence: isShortcut ? 0.9 : 0.82,
      reason: `Matched development keyword "${devKeyword}".`
    };
  }

  for (const category of DEFAULT_CATEGORIES) {
    if (category.id === "games" || category.id === "development" || category.id === "other") {
      continue;
    }
    if (category.extensions.includes(ext)) {
      return {
        categoryId: category.id,
        confidence: isShortcut ? 0.72 : 0.94,
        reason: `Matched extension ${ext}.`
      };
    }
  }

  if (isFolder) {
    for (const categoryId of ["documents", "images", "videos", "audio", "archives", "applications"]) {
      const category = getCategory(categoryId);
      const keyword = matchKeyword(category, haystack);
      if (keyword) {
        return {
          categoryId,
          confidence: 0.7,
          reason: `Folder name matched "${keyword}".`
        };
      }
    }
    return {
      categoryId: "folders",
      confidence: 0.58,
      reason: "Directory without a stronger category match."
    };
  }

  if (isShortcut || INSTALLER_EXTENSIONS.has(ext)) {
    return {
      categoryId: "applications",
      confidence: 0.64,
      reason: "Shortcut or installable application file."
    };
  }

  return {
    categoryId: "other",
    confidence: 0.35,
    reason: "No local rule matched."
  };
}

function attachClassification(item) {
  const classification = classifyItem(item);
  return {
    ...item,
    ...classification
  };
}

module.exports = {
  classifyItem,
  attachClassification,
  normalizeText
};
