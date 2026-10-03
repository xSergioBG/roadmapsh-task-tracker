const fs = require("node:fs");
const path = require("node:path");

const tasksFilePath = process.env.TASKS_FILE || path.join(__dirname, "tasks.json");
const statuses = new Set(["todo", "in-progress", "done"]);

function readTasks() {
  let data;
  try { data = fs.readFileSync(tasksFilePath, "utf8"); }
  catch (error) { if (error.code === "ENOENT") return []; throw error; }
  const tasks = data.trim() ? JSON.parse(data) : [];
  if (!Array.isArray(tasks) || tasks.some(t => !t || !Number.isSafeInteger(t.id) ||
      t.id < 1 || typeof t.description !== "string" || !statuses.has(t.status)) ||
      new Set(tasks.map(t => t.id)).size !== tasks.length) {
    throw new Error("Invalid tasks file; recover it before making changes.");
  }
  return tasks;
}

function writeTasks(tasks) {
  const temporary = tasksFilePath + "." + process.pid + ".tmp";
  try {
    fs.writeFileSync(temporary, JSON.stringify(tasks, null, 2));
    fs.renameSync(temporary, tasksFilePath);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

function requireDescription(description) {
  if (typeof description !== "string" || !description.trim()) {
    throw new Error("Task description cannot be empty.");
  }
  return description.trim();
}

function requireId(id) {
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("ID must be a positive integer.");
}

function findTask(tasks, id) {
  requireId(id);
  const task = tasks.find(t => t.id === id);
  if (!task) throw new Error(`Task with ID ${id} not found.`);
  return task;
}

function addTask(description) {
  description = requireDescription(description);
  const tasks = readTasks();
  const id = tasks.reduce((maximum, task) => Math.max(maximum, task.id), 0) + 1;
  requireId(id);
  const now = new Date().toISOString();
  tasks.push({ id, description, status: "todo", createdAt: now, updatedAt: now });
  writeTasks(tasks);
  console.log(`Task added successfully (ID: ${id})`);
}

function updateTask(id, description) {
  description = requireDescription(description);
  const tasks = readTasks();
  const task = findTask(tasks, id);
  task.description = description;
  task.updatedAt = new Date().toISOString();
  writeTasks(tasks);
  console.log(`Task ${id} updated successfully.`);
}

function deleteTask(id) {
  const tasks = readTasks();
  findTask(tasks, id);
  writeTasks(tasks.filter(t => t.id !== id));
  console.log(`Task ${id} deleted successfully.`);
}

function mark(id, status) {
  const tasks = readTasks();
  const task = findTask(tasks, id);
  task.status = status;
  task.updatedAt = new Date().toISOString();
  writeTasks(tasks);
  console.log(`Task ${id} marked as ${status}.`);
}

function listTasks(statusFilter = null) {
  if (statusFilter && !statuses.has(statusFilter)) throw new Error("Invalid status filter.");
  const tasks = readTasks().filter(t => !statusFilter || t.status === statusFilter);
  if (!tasks.length) console.log("No tasks found.");
  for (const task of tasks) console.log(`ID: ${task.id}, Description: ${task.description}, Status: ${task.status}, Created At: ${task.createdAt}, Updated At: ${task.updatedAt}`);
}

module.exports = {
  addTask, updateTask, deleteTask, listTasks,
  markInProgress: id => mark(id, "in-progress"),
  markDone: id => mark(id, "done"),
};
