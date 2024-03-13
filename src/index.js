/* Archivo que arranca el servidor */
const express = require('express');
const morgan = require('morgan'); //Morgan es un middleware que se ejecuta antes y durante una solicitud HTTP, registra los request entre otros.

const taskRoutes = require('./routes/tasks.routes'); //importamos el modulo tasksroutes.js 

const app = express();

app.use(morgan('dev'));
app.use(taskRoutes);

const PORT = 4000;
app.listen(PORT);
console.log(`Server on port ${PORT} or http://localhost:${PORT}`);