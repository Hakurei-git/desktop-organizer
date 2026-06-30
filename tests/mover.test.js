const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const {
  createMovePlan,
  applyMovePlan,
  undoMoveHistory,
  sanitizeSegment
} = require("../src/core/mover");

async function createTempDir() {
  return fsp.mkdtemp(path.join(os.tmpdir(), "desktop-organizer-test-"));
}

test("sanitizes category path segments", () => {
  assert.equal(sanitizeSegment("Bad:/Name*"), "Bad--Name-");
});

test("creates move plan with category folders", async () => {
  const root = await createTempDir();
  const source = path.join(root, "note.txt");
  fs.writeFileSync(source, "hello");

  const plan = createMovePlan(
    [
      {
        id: "1",
        name: "note.txt",
        sourcePath: source,
        categoryId: "documents",
        movable: true
      }
    ],
    path.join(root, "organized")
  );

  assert.equal(plan.items.length, 1);
  assert.match(plan.items[0].destinationPath, /Documents/);
});

test("moves files, resolves name conflicts, and undoes the move", async () => {
  const root = await createTempDir();
  const destinationRoot = path.join(root, "organized");
  const sourceA = path.join(root, "report.txt");
  const sourceB = path.join(root, "nested", "report.txt");

  await fsp.mkdir(path.dirname(sourceB), { recursive: true });
  await fsp.writeFile(sourceA, "A");
  await fsp.writeFile(sourceB, "B");

  const plan = createMovePlan(
    [
      {
        id: "a",
        name: "report.txt",
        sourcePath: sourceA,
        categoryId: "documents",
        movable: true
      },
      {
        id: "b",
        name: "report.txt",
        sourcePath: sourceB,
        categoryId: "documents",
        movable: true
      }
    ],
    destinationRoot
  );

  const history = await applyMovePlan(plan);
  assert.equal(history.items.every((item) => item.status === "moved"), true);
  assert.equal(fs.existsSync(sourceA), false);
  assert.equal(fs.existsSync(sourceB), false);
  assert.equal(new Set(history.items.map((item) => item.destinationPath)).size, 2);

  const undo = await undoMoveHistory(history);
  assert.equal(undo.items.every((item) => item.undoStatus === "restored"), true);
  assert.equal(fs.readFileSync(sourceA, "utf8"), "A");
  assert.equal(fs.readFileSync(sourceB, "utf8"), "B");
});
