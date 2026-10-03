#!/usr/bin/env node
const tasks = require("./task");
const [command, ...args] = process.argv.slice(2);
const usage = "Commands: add, update, delete, mark-in-progress, mark-done, list";
function id(value) {
  if (!/^[1-9]\d*$/.test(value || "") || !Number.isSafeInteger(Number(value))) {
    throw new Error("ID must be a positive integer.");
  }
  return Number(value);
}
try {
  switch (command) {
    case "add": tasks.addTask(args.join(" ")); break;
    case "update": tasks.updateTask(id(args[0]), args.slice(1).join(" ")); break;
    case "delete":
    case "mark-in-progress":
    case "mark-done": {
      if (args.length !== 1) throw new Error("Provide exactly one ID.");
      const action = { delete: "deleteTask", "mark-in-progress": "markInProgress", "mark-done": "markDone" }[command];
      tasks[action](id(args[0]));
      break;
    }
    case "list":
      if (args.length > 1) throw new Error("Provide at most one status filter.");
      tasks.listTasks(args[0]); break;
    case "--help": case "-h": console.log(usage); break;
    default: throw new Error(usage);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
