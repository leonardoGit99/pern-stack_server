/* Ejecutan funciones cuando una URL o endpoint es visitada */
const pool = require('../db'); // importamos el objeto que permite interactuar con la BD


const getAllTasks = async (req, res, next) => {
  try {
    const allTasks = await pool.query("SELECT * FROM task");
    res.json(allTasks.rows);

  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM task WHERE task.id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" })
    }
    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  /* Debido a que el en la BD el campo title tiene la propiedad unique, no puede duplicarse,
    por lo cual, si intentamos agregar un titulo que ya existe en la bd, el servidor se cae, 
    entonces tenemos que utilizar un try catch para manejar este error. */
  try {
    const { title, description } = req.body;
    // $1 $2 le dice a la BD que le enviaremos 2 valores en cierto orden que definiremos con el arreglo
    // Returning nos permite devolver los datos que se insertaron en la propiedad rows de result
    const result = await pool.query(
      "INSERT INTO task (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );

    res.send('Task created succesfully');
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM task WHERE task.id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Task not found"
      })
    };
    return res.status(204).json({
      message: "Task deleted"
    })
  } catch (error) {
    next(error);
  }
};


const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const result = await pool.query(
      "UPDATE task SET title = $1, description = $2 WHERE task.id = $3 RETURNING *",
      [title, description, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};



// Exportamos un objeto de exportaciones debido a que no solo será un modulo.
module.exports = {
  getAllTasks: getAllTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask
};