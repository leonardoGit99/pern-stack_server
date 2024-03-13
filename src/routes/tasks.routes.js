/* End Points que el frontend pueda utilizar*/

const { Router } = require('express'); // Extraemos Router de express y lo ejecutamos para que nos permita hacer el routing en nuestra app
const { getAllTasks, getTask, createTask, deleteTask, updateTask } = require('../controllers/tasks.controller');
const pool = require('../db');


const router = Router();

/* Rutas de la app */
//Ejemplo de una ruta sin un controller.
/* router.get('/tasks', (req, res) => {  // El segundo parámetro del metodo get, ejecuta una funcion que sera emitida una vez se visite la ruta
  res.send('retrieving a list of tasks'); // que está en el segundo parametro. Por lo cual, conviene separar esta funcion en los controllers, exportarlas
                                          // e importarlas desde este archivo para que sea mas organizado.
}); */

router.get('/tasks', getAllTasks);

router.get('/tasks/:id', getTask);

router.post('/tasks', createTask);

router.delete('/tasks', deleteTask);

router.put('/tasks', updateTask);



module.exports = router; //Exportamos el modulo (objeto) router que contiene las distintas rutas de la app.