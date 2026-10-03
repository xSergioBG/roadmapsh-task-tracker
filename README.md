# Task Tracker CLI

Gestor de tareas desde la terminal, implementado con Node.js y sus módulos nativos. Ejercicio basado en [Task Tracker de roadmap.sh](https://roadmap.sh/projects/task-tracker).

## Uso

Requiere Node.js 22 o posterior. No necesita dependencias externas.

```sh
git clone https://github.com/xSergioBG/roadmapsh-task-tracker.git
cd roadmapsh-task-tracker
node task-cli.js add "Comprar pan"
node task-cli.js update 1 "Comprar pan y leche"
node task-cli.js mark-in-progress 1
node task-cli.js list in-progress
node task-cli.js mark-done 1
node task-cli.js list done
node task-cli.js delete 1
```

Los estados admitidos son `todo`, `in-progress` y `done`. `list` sin filtro muestra todas las tareas.

## Datos y errores

Las tareas se guardan en `tasks.json`, junto a los scripts. El archivo se crea al guardar la primera tarea. Para aislar datos o pruebas se puede definir `TASKS_FILE` con otra ruta; la carpeta debe existir.

Cada tarea incluye ID, descripción, estado y fechas de creación y modificación. Las entradas incorrectas, los IDs inexistentes y los errores de lectura o escritura devuelven código de salida 1. Un JSON dañado se conserva y debe recuperarse antes de continuar.

La escritura utiliza un archivo temporal y reemplazo. Es una herramienta local para un único proceso escritor; no incluye coordinación entre procesos concurrentes.

## Validación

```sh
npm test
```

Las pruebas usan carpetas temporales y cubren el ciclo de vida, los IDs, la validación, la conservación de archivos dañados y los fallos de escritura.
