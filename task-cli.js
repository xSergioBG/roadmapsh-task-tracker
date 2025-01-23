const {
  addTask,
  updateTask,
  deleteTask,
  markInProgress,
  markDone,
  listTasks,
} = require("./task");

// Obtener los argumentos de la línea de comandos
const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log(
    "Comando no proporcionado. Comandos disponibles: add, update, delete, mark-in-progress, mark-done, list"
  );
  process.exit(1);
}

switch (command) {
  case "add":
    const description = args.slice(1).join(" ");
    if (!description) {
      console.log("Error: La descripción de la tarea es obligatoria.");
      return;
    }
    addTask(description);
    break;

  case "update":
    if (args.length < 3) {
      console.log("Error: Se requiere ID y descripción.");
      return;
    }
    const updateId = parseInt(args[1], 10);
    if (isNaN(updateId)) {
      console.log("Error: El ID debe ser un número válido.");
      return;
    }
    const updateDescription = args.slice(2).join(" ");
    updateTask(updateId, updateDescription);
    break;

  case "delete":
    if (args.length < 2) {
      console.log("Error: Se requiere el ID de la tarea.");
      return;
    }
    const deleteId = parseInt(args[1], 10);
    if (isNaN(deleteId)) {
      console.log("Error: El ID debe ser un número válido.");
      return;
    }
    deleteTask(deleteId);
    break;

  case "mark-in-progress":
    if (args.length < 2) {
      console.log("Error: Se requiere el ID de la tarea.");
      return;
    }
    const inProgressId = parseInt(args[1], 10);
    if (isNaN(inProgressId)) {
      console.log("Error: El ID debe ser un número válido.");
      return;
    }
    markInProgress(inProgressId);
    break;

  case "mark-done":
    if (args.length < 2) {
      console.log("Error: Se requiere el ID de la tarea.");
      return;
    }
    const doneId = parseInt(args[1], 10);
    if (isNaN(doneId)) {
      console.log("Error: El ID debe ser un número válido.");
      return;
    }
    markDone(doneId);
    break;

  case "list":
    const statusFilter = args[1];
    listTasks(statusFilter);
    break;

  default:
    console.log(
      "Comando inválido. Comandos disponibles: add, update, delete, mark-in-progress, mark-done, list"
    );
    break;
}
