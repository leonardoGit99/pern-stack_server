/* Ejecutan funciones cuando una URL o endpoint es visitada */
const pool = require('../db'); // importamos el objeto que permite interactuar con la BD
const fs = require('node:fs');

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
      'SELECT * FROM task t JOIN image i ON t.task_id = $1',
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
    const images = req.files.map(saveImage);
    // $1 $2 le dice a la BD que le enviaremos 2 valores en cierto orden que definiremos con el arreglo
    // Returning nos permite devolver los datos que se insertaron en la propiedad rows de result
    const result = await pool.query(
      "INSERT INTO task (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    
    console.log(result);
    const taskId = result.rows[0].task_id;
    // Insertar las imágenes asociadas a la tarea
    if (images && images.length > 0) {
      const insertImageQuery = 'INSERT INTO image (task_id, image_path) VALUES ($1, $2)';
      for (const newPath of images) {
        await pool.query(insertImageQuery, [taskId, newPath]);
      }
    }

    res.status(201).json({
      message: 'Task created successfully',
      task: result.rows[0] 
    });
  } catch (error) {
    next(error);
  }
};

// Se encarga de renombrar el archivo (fieldname) por el nombre original con la que es subido (originalname)
function saveImage(file) { 
  const newPath = `./uploads/${file.originalname}`;
  fs.renameSync(file.path, newPath);
  return newPath;
}

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM task WHERE task.task_id = $1 RETURNING *",
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
      "UPDATE task SET title = $1, description = $2 WHERE task.task_id = $3 RETURNING *",
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