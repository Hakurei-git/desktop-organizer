const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { getCategory } = require("./categories");

function defaultDestinationRoot() {
  return path.join(os.homedir(), "Documents", "Desktop Organizer");
}

function sanitizeSegment(segment) {
  return String(segment || "Other")
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80) || "Other";
}

async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function uniquePath(targetPath) {
  if (!(await exists(targetPath))) {
    return targetPath;
  }

  const parsed = path.parse(targetPath);
  for (let index = 1; index < 1000; index += 1) {
    const candidate = path.join(parsed.dir, `${parsed.name} (${index})${parsed.ext}`);
    if (!(await exists(candidate))) {
      return candidate;
    }
  }

  throw new Error(`Could not allocate a unique destination for ${targetPath}`);
}

function isChildPath(parentPath, childPath) {
  const relative = path.relative(parentPath, childPath);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

async function copyRecursive(sourcePath, destinationPath) {
  const stats = await fs.lstat(sourcePath);
  if (stats.isDirectory()) {
    await fs.mkdir(destinationPath, { recursive: true });
    const entries = await fs.readdir(sourcePath);
    for (const entry of entries) {
      await copyRecursive(path.join(sourcePath, entry), path.join(destinationPath, entry));
    }
    return;
  }
  await fs.copyFile(sourcePath, destinationPath);
}

async function removeRecursive(targetPath) {
  await fs.rm(targetPath, { recursive: true, force: true });
}

async function movePath(sourcePath, destinationPath) {
  try {
    await fs.rename(sourcePath, destinationPath);
  } catch (error) {
    if (error.code !== "EXDEV") {
      throw error;
    }
    await copyRecursive(sourcePath, destinationPath);
    await removeRecursive(sourcePath);
  }
}

function createMovePlan(items, destinationRoot = defaultDestinationRoot()) {
  const movableItems = items.filter((item) => item.movable !== false && item.sourcePath);
  const createdAt = new Date().toISOString();

  return {
    id: `move-${Date.now()}`,
    destinationRoot,
    createdAt,
    items: movableItems.map((item) => {
      const category = getCategory(item.categoryId);
      const categoryDir = sanitizeSegment(category.name);
      const baseName = path.basename(item.sourcePath);
      return {
        itemId: item.id,
        name: item.name,
        categoryId: category.id,
        sourcePath: item.sourcePath,
        destinationPath: path.join(destinationRoot, categoryDir, baseName),
        status: "pending"
      };
    })
  };
}

async function applyMovePlan(plan) {
  const results = [];

  for (const entry of plan.items) {
    const result = { ...entry };
    try {
      if (isChildPath(entry.sourcePath, entry.destinationPath)) {
        throw new Error("Destination cannot be inside the source path.");
      }
      const finalDestination = await uniquePath(entry.destinationPath);
      await fs.mkdir(path.dirname(finalDestination), { recursive: true });
      await movePath(entry.sourcePath, finalDestination);
      result.destinationPath = finalDestination;
      result.status = "moved";
      result.movedAt = new Date().toISOString();
    } catch (error) {
      result.status = "failed";
      result.error = error.message;
    }
    results.push(result);
  }

  return {
    ...plan,
    items: results,
    appliedAt: new Date().toISOString()
  };
}

async function undoMoveHistory(moveHistoryEntry) {
  const results = [];
  const movedItems = [...(moveHistoryEntry?.items || [])].reverse();

  for (const entry of movedItems) {
    if (entry.status !== "moved") {
      continue;
    }

    const result = { ...entry };
    try {
      const restorePath = await uniquePath(entry.sourcePath);
      await fs.mkdir(path.dirname(restorePath), { recursive: true });
      await movePath(entry.destinationPath, restorePath);
      result.restorePath = restorePath;
      result.undoStatus = "restored";
      result.undoneAt = new Date().toISOString();
    } catch (error) {
      result.undoStatus = "failed";
      result.undoError = error.message;
    }
    results.push(result);
  }

  return {
    id: `undo-${Date.now()}`,
    sourceMoveId: moveHistoryEntry?.id,
    items: results,
    undoneAt: new Date().toISOString()
  };
}

module.exports = {
  defaultDestinationRoot,
  sanitizeSegment,
  uniquePath,
  createMovePlan,
  applyMovePlan,
  undoMoveHistory
};
