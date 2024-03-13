/* End Points que el frontend pueda utilizar*/

const { Router } = require('express'); // Extraemos Router de express y lo ejecutamos para que nos permita hacer el routing en nuestra app

const router = Router();

router.get('/tasks', (req, res) => {
  res.send('retrieving a list of tasks');
});

router.get('/tasks/10', (req, res) => {
  res.send('retrieving a single task');
});

router.post('/tasks', (req, res) => {
  res.send('creating a task');
});

router.delete('/tasks', (req, res) => {
  res.send('deleting a task');
});

router.put('/tasks', (req, res) => {
  res.send('updating a task');
});



module.exports = router; //Exportamos el modulo (objeto) router que contiene las distintas rutas de la app.