const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { attachClassification } = require("./classifier");
const { DEFAULT_CATEGORIES } = require("./categories");

const SHORTCUT_EXTENSIONS = new Set([".lnk", ".url", ".desktop", ".appref-ms"]);

function pathExists(targetPath) {
  return fs
    .access(targetPath)
    .then(() => true)
    .catch(() => false);
}

function createId(value) {
  return crypto.createHash("sha1").update(value).digest("hex").slice(0, 16);
}

function getDesktopPath() {
  return path.join(os.homedir(), "Desktop");
}

function defaultSources() {
  const sources = [
    {
      id: "desktop",
      label: "Desktop",
      path: getDesktopPath(),
      type: "desktop",
      depth: 0,
      movable: true
    }
  ];

  if (process.platform === "win32") {
    const appData = process.env.APPDATA;
    const programData = process.env.PROGRAMDATA;
    const publicDesktop = process.env.PUBLIC ? path.join(process.env.PUBLIC, "Desktop") : null;

    if (publicDesktop) {
      sources.push({
        id: "public-desktop",
        label: "Public Desktop",
        path: publicDesktop,
        type: "desktop",
        depth: 0,
        movable: true
      });
    }

    if (appData) {
      sources.push({
        id: "user-start-menu",
        label: "Start Menu",
        path: path.join(appData, "Microsoft", "Windows", "Start Menu", "Programs"),
        type: "applications",
        depth: 3,
        movable: false
      });
    }

    if (programData) {
      sources.push({
        id: "system-start-menu",
        label: "System Start Menu",
        path: path.join(programData, "Microsoft", "Windows", "Start Menu", "Programs"),
        type: "applications",
        depth: 3,
        movable: false
      });
    }
  } else if (process.platform === "darwin") {
    sources.push({
      id: "applications",
      label: "Applications",
      path: "/Applications",
      type: "applications",
      depth: 0,
      movable: false
    });
  } else {
    sources.push({
      id: "linux-applications",
      label: "Applications",
      path: "/usr/share/applications",
      type: "applications",
      depth: 1,
      movable: false
    });
  }

  return sources;
}

function mergeSources(customSources = []) {
  const sources = [...defaultSources()];
  for (const source of customSources) {
    if (!source || !source.path) {
      continue;
    }
    sources.push({
      id: source.id || createId(source.path),
      label: source.label || path.basename(source.path) || source.path,
      path: source.path,
      type: "custom",
      depth: Number.isInteger(source.depth) ? source.depth : 0,
      movable: source.movable !== false
    });
  }
  return sources;
}

async function readDesktopUrl(filePath) {
  if (path.extname(filePath).toLowerCase() !== ".url") {
    return null;
  }
  try {
    const content = await fs.readFile(filePath, "utf8");
    const match = content.match(/^URL=(.+)$/im);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

async function readDesktopEntry(filePath) {
  if (path.extname(filePath).toLowerCase() !== ".desktop") {
    return null;
  }
  try {
    const content = await fs.readFile(filePath, "utf8");
    const name = content.match(/^Name=(.+)$/im)?.[1]?.trim();
    const exec = content.match(/^Exec=(.+)$/im)?.[1]?.trim();
    return { name, targetPath: exec };
  } catch {
    return null;
  }
}

function itemKind(entry, fullPath) {
  if (entry.isDirectory()) {
    if (process.platform === "darwin" && path.extname(fullPath).toLowerCase() === ".app") {
      return "app";
    }
    return "folder";
  }
  const ext = path.extname(fullPath).toLowerCase();
  if (SHORTCUT_EXTENSIONS.has(ext)) {
    return "shortcut";
  }
  if (ext === ".exe" || ext === ".app") {
    return "app";
  }
  return "file";
}

async function scanDirectory(source, currentPath = source.path, depth = source.depth) {
  const items = [];
  let entries;

  try {
    entries = await fs.readdir(currentPath, { withFileTypes: true });
  } catch (error) {
    return {
      items,
      error: {
        sourceId: source.id,
        path: currentPath,
        message: error.message
      }
    };
  }

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    const fullPath = path.join(currentPath, entry.name);
    const kind = itemKind(entry, fullPath);

    if (entry.isDirectory() && depth > 0 && kind !== "app") {
      const nested = await scanDirectory(source, fullPath, depth - 1);
      items.push(...nested.items);
      continue;
    }

    const desktopEntry = await readDesktopEntry(fullPath);
    const urlTarget = await readDesktopUrl(fullPath);
    const sourceType = source.type || "custom";
    const baseName = desktopEntry?.name || entry.name;
    const rawItem = {
      id: createId(`${source.id}:${fullPath}`),
      name: baseName,
      kind,
      sourceId: source.id,
      sourceLabel: source.label,
      sourceType,
      sourcePath: fullPath,
      targetPath: desktopEntry?.targetPath || urlTarget || null,
      movable: Boolean(source.movable && sourceType !== "applications" && kind !== "app")
    };

    items.push(attachClassification(rawItem));
  }

  return { items, error: null };
}

async function scanSources(customSources = []) {
  const sources = mergeSources(customSources);
  const activeSources = [];
  const errors = [];
  const items = [];

  for (const source of sources) {
    if (!(await pathExists(source.path))) {
      errors.push({
        sourceId: source.id,
        path: source.path,
        message: "Path does not exist."
      });
      continue;
    }
    activeSources.push(source);
    const result = await scanDirectory(source);
    items.push(...result.items);
    if (result.error) {
      errors.push(result.error);
    }
  }

  return {
    categories: DEFAULT_CATEGORIES,
    sources: activeSources,
    items,
    errors,
    scannedAt: new Date().toISOString()
  };
}

module.exports = {
  scanSources,
  defaultSources,
  mergeSources,
  createId
};
