const fs = require("fs");
const path = require("path");

const tasksFilePath = path.join(__dirname, "tasks.json");

function readTasks() {
  try {
    const data = fs.readFileSync(tasksFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe o está vacío, retornamos un array vacío
    return [];
  }
}

function writeTasks(tasks) {
  try {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Error writing tasks to file:", error.message);
  }
}

function addTask(description) {
  if (!description.trim()) {
    console.log("Task description cannot be empty.");
    return;
  }
  const tasks = readTasks();
  const id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
  const newTask = {
    id,
    description,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  writeTasks(tasks);
  console.log(`Task added successfully (ID: ${id})`);
}

function updateTask(id, description) {
  if (!description.trim()) {
    console.log("Task description cannot be empty.");
    return;
  }
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    console.log(`Task with ID ${id} not found.`);
    return;
  }
  task.description = description;
  task.updatedAt = new Date().toISOString();
  writeTasks(tasks);
  console.log(`Task ${id} updated successfully.`);
}

function deleteTask(id) {
  let tasks = readTasks();
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    console.log(`Task with ID ${id} not found.`);
    return;
  }
  tasks.splice(taskIndex, 1);
  writeTasks(tasks);
  console.log(`Task ${id} deleted successfully.`);
}

function markInProgress(id) {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    console.log(`Task with ID ${id} not found.`);
    return;
  }
  task.status = "in-progress";
  task.updatedAt = new Date().toISOString();
  writeTasks(tasks);
  console.log(`Task ${id} marked as in-progress.`);
}

function markDone(id) {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    console.log(`Task with ID ${id} not found.`);
    return;
  }
  task.status = "done";
  task.updatedAt = new Date().toISOString();
  writeTasks(tasks);
  console.log(`Task ${id} marked as done.`);
}

function listTasks(statusFilter = null) {
  const tasks = readTasks();
  let filteredTasks = tasks;

  if (statusFilter) {
    filteredTasks = tasks.filter((t) => t.status === statusFilter);
  }

  if (filteredTasks.length === 0) {
    console.log("No tasks found.");
    return;
  }

  filteredTasks.forEach((task) => {
    console.log(
      `ID: ${task.id}, Description: ${task.description}, Status: ${task.status}, Created At: ${task.createdAt}, Updated At: ${task.updatedAt}`
    );
  });
}

module.exports = {
  addTask,
  updateTask,
  deleteTask,
  markInProgress,
  markDone,
  listTasks,
};
