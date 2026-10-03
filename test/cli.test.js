const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const cli = path.resolve(__dirname, "../task-cli.js");
function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "task-cli-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, "tasks.json");
  return { file, run: (...args) => spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8", env: { ...process.env, TASKS_FILE: file },
  }), read: () => JSON.parse(fs.readFileSync(file, "utf8")) };
}
test("task lifecycle persists across separate CLI invocations", t => {
  const f = fixture(t);
  assert.equal(f.run("add", "Comprar pan").status, 0);
  assert.equal(f.run("update", "1", "Comprar leche").status, 0);
  assert.equal(f.run("mark-in-progress", "1").status, 0);
  assert.match(f.run("list", "in-progress").stdout, /Comprar leche/);
  assert.equal(f.run("mark-done", "1").status, 0);
  assert.equal(f.read()[0].status, "done");
  assert.equal(f.run("delete", "1").status, 0);
  assert.deepEqual(f.read(), []);
});
test("new IDs use the maximum even if persisted rows are out of order", t => {
  const f = fixture(t);
  fs.writeFileSync(f.file, JSON.stringify([
    { id: 9, description: "A", status: "todo" },
    { id: 2, description: "B", status: "todo" },
  ]));
  assert.equal(f.run("add", "C").status, 0);
  assert.equal(f.read()[2].id, 10);
});
test("invalid commands and partial IDs fail without changing data", t => {
  const f = fixture(t); f.run("add", "A");
  const before = fs.readFileSync(f.file, "utf8");
  for (const args of [["delete", "1abc"], ["update", "0", "B"], ["list", "bad"], ["unknown"], ["add", "   "], ["delete", "99"]]) {
    assert.equal(f.run(...args).status, 1, args.join(" "));
    assert.equal(fs.readFileSync(f.file, "utf8"), before);
  }
});
test("malformed JSON is reported and preserved", t => {
  const f = fixture(t); fs.writeFileSync(f.file, "{broken");
  assert.equal(f.run("add", "A").status, 1);
  assert.equal(fs.readFileSync(f.file, "utf8"), "{broken");
});
test("invalid data shape is reported and preserved", t => {
  const f = fixture(t); fs.writeFileSync(f.file, "{}");
  assert.equal(f.run("add", "A").status, 1);
  assert.equal(fs.readFileSync(f.file, "utf8"), "{}");
});
test("write failure returns a nonzero status instead of reporting success", t => {
  const f = fixture(t);
  fs.mkdirSync(f.file + "." + "unused");
  const result = spawnSync(process.execPath, [cli, "add", "A"], {
    encoding: "utf8", env: { ...process.env, TASKS_FILE: path.join(f.file, "missing", "tasks.json") },
  });
  assert.equal(result.status, 1);
  assert.doesNotMatch(result.stdout, /successfully/);
});
