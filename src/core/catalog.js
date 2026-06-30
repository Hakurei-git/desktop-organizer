const { DEFAULT_CATEGORIES, getCategory } = require("./categories");
const { normalizeText } = require("./classifier");

function makeCustomCategory(name, accent = "#2563eb") {
  const cleanName = String(name || "").trim();
  if (!cleanName) {
    throw new Error("Category name is required.");
  }

  return {
    id: `custom-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name: cleanName.slice(0, 36),
    accent,
    icon: cleanName.slice(0, 4).toUpperCase(),
    custom: true,
    extensions: [],
    keywords: []
  };
}

function mergeCategories(customCategories = []) {
  const seen = new Set(DEFAULT_CATEGORIES.map((category) => category.id));
  const custom = [];

  for (const category of customCategories) {
    if (!category?.id || seen.has(category.id)) {
      continue;
    }
    seen.add(category.id);
    custom.push({
      accent: "#2563eb",
      icon: "CAT",
      extensions: [],
      keywords: [],
      custom: true,
      ...category,
      custom: true
    });
  }

  return [...DEFAULT_CATEGORIES, ...custom];
}

function applyManualAssignments(items = [], manualAssignments = {}) {
  return items.map((item) => {
    const categoryId = manualAssignments[item.id];
    if (!categoryId) {
      return item;
    }

    const category = getCategory(categoryId);
    return {
      ...item,
      categoryId,
      confidence: 1,
      reason: category.id === "other" ? "Manual category assignment." : "Manual category assignment.",
      manualCategory: true
    };
  });
}

function searchItems(items = [], query = "", activeCategoryId = null) {
  const normalizedQuery = normalizeText(query);

  return items.filter((item) => {
    if (activeCategoryId && item.categoryId !== activeCategoryId) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = normalizeText(
      `${item.name || ""} ${item.sourceLabel || ""} ${item.reason || ""} ${item.kind || ""}`
    );
    return haystack.includes(normalizedQuery);
  });
}

module.exports = {
  makeCustomCategory,
  mergeCategories,
  applyManualAssignments,
  searchItems
};
