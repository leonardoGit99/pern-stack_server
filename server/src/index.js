/* Archivo que arranca el servidor */
const express = require('express');
const morgan = require('morgan'); //Morgan es un middleware que se ejecuta antes y durante una solicitud HTTP, registra los request entre otros.
const cors = require('cors'); // Modulo que permite comunicar ambos servidores de manera simple (React + Express)



const taskRoutes = require('./routes/tasks.routes'); //importamos el modulo tasksroutes.js 
const imgsRoutes = require('./routes/imgs.routes');



const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // Para que express pueda entender el formato json para post

app.use(taskRoutes);
app.use(imgsRoutes);


app.use((err, req, res, next) => { // Middleware de error, es como un manejador de error común para todas las rutas,
  return res.json({                // Cada ruta será redireccionada a esta funcion mediante next() cuando ocurra algun error en el catch
    message: err.message
  });
});

const PORT = 4000;
app.listen(PORT);
console.log(`Server listening...`);