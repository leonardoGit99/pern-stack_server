/* Ejecutan funciones cuando una URL o endpoint es visitada */
const pool = require('../db'); // importamos el objeto que permite interactuar con la BD
const { saveImageToCloudinary, deleteImageFromCloudinary } = require('../utils/cloudinary');
// const fs = require('node:fs');
// const path = require('path');

const getAllTasks = async (req, res, next) => {
  try {
    // Query devuelve todas las tareas registradas
    const allTasks = await pool.query("SELECT * FROM task");
    
    res.json(allTasks.rows);

  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Query devuelve id, titulo, descripcion, array de imagenes de una tareas
    // LEFT JOIN PARA QUE DEVUELVA TODOS LOS REGISTROS DE LA TABLA "TASK" Y LAS FILAS COINCIDENTES DE LA TABLA "IMAGE",
    // SI NO HAY COINCIDENCIAS EN LA TABLA "IMAGE", SERAN NULL
    const result = await pool.query(
      'SELECT t.task_id, t.title, t.description, t.state_task, ARRAY_AGG(i.image_path) AS image_paths FROM task t LEFT JOIN image i ON t.task_id = i.task_id WHERE t.task_id = $1 GROUP BY t.task_id, t.title, t.description, t.state_task',
      [id]
    );

    // Si no existe imagenes, result devuelve image_paths: [null], el if sirve para convertilo a arreglo vacio.
    if (result.rows.length > 0 && result.rows[0].image_paths[0] === null) {
      result.rows[0].image_paths = [];
    }

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
    const defaultStateTask = "ToDo"
    // $1 $2 le dice a la BD que le enviaremos 2 valores en cierto orden que definiremos con el arreglo
    // Returning nos permite devolver los datos que se insertaron en la propiedad rows de result
    const result = await pool.query(
      "INSERT INTO task (title, description, state_task) VALUES ($1, $2, $3) RETURNING *",
      [title, description, defaultStateTask]
    );
    const taskId = result.rows[0].task_id;

    //Promise.all receives a "promises array" and the "Promise.all" is resolved when all the elements of this array are solved
    const images = await Promise.all(req.files.map((file) => saveImageToCloudinary(file, taskId)));

    // Inserta las imágenes asociadas a la tarea
    if (images && images.length > 0) {
      const insertImageQuery = 'INSERT INTO image (task_id, image_path) VALUES ($1, $2) RETURNING *';
      for (const urlpath of images) {
        await pool.query(insertImageQuery, [taskId, urlpath]);
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


/* const updateTask = async (req, res, next) => {
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
    console.log(result.rows);

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}; */

const updateTask = async (req, res, next) => {
  const client = await pool.connect(); // Exclusive conection
  try {
    const { id } = req.params; // Task ID
    const { title, description, imageUrls, stateTask } = req.body;

    // Begin transaction
    await client.query('BEGIN');

    // Update Task, It means: "title and description"
    await client.query(
      "UPDATE task SET title = $1, description = $2, state_task = $3 WHERE task.task_id = $4 RETURNING *",
      [title, description, stateTask, id]
    );


    // Delete selected images
    if (imageUrls && imageUrls.length > 0) {
      for (const publicUrl of imageUrls) {
        const idExtracted = extractPublicIdFromUrl(publicUrl); // Extracting "id cloudinary = archive name" from public url

        if (idExtracted) {
          // Delete from Cloudinary
          await deleteImageFromCloudinary(idExtracted);

          // Delete from DB
          await client.query('DELETE FROM image WHERE task_id = $1 AND image_path = $2', [id, publicUrl]);
        }
      }
    }

    // Upload new images asociated to a one task
    if (req.files && req.files.length > 0) {
      const newImages = await Promise.all(req.files.map(file => saveImageToCloudinary(file, id)));
      if (newImages && newImages.length > 0) {
        const insertImageQuery = 'INSERT INTO image (task_id, image_path) VALUES ($1, $2) RETURNING *';
        for (const urlpath of newImages) {
          await client.query(insertImageQuery, [id, urlpath]);
        }
      }
    }

    // Confirm transaction
    await client.query('COMMIT');

    res.status(200).json({
      message: 'Task updated successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(200).json({
      message: error
    });
    next(error);
  } finally {
    client.release(); // Leave conection
  }
};

const extractPublicIdFromUrl = (url) => {
  // Expresión regular extrae el public_id completo desde la URL de Cloudinary
  const regex = /\/upload\/v\d+\/task\/(task_\d+_[^\.]+)/;
  const match = url.match(regex);
  if (match) {
    // match[1] es el taskId y match[2] es el filename (sin la extensión)
    return match[1];
  }
  return null;
};

// const createTask = async (req, res, next) => {
//   /* Debido a que el en la BD el campo title tiene la propiedad unique, no puede duplicarse,
//     por lo cual, si intentamos agregar un titulo que ya existe en la bd, el servidor se cae, 
//     entonces tenemos que utilizar un try catch para manejar este error. */
//   try {
//     const { title, description } = req.body;
//     // $1 $2 le dice a la BD que le enviaremos 2 valores en cierto orden que definiremos con el arreglo
//     // Returning nos permite devolver los datos que se insertaron en la propiedad rows de result
//     const result = await pool.query(
//       "INSERT INTO task (title, description) VALUES ($1, $2) RETURNING *",
//       [title, description]
//     );

//     const taskId = result.rows[0].task_id;
//     const images = req.files.map((file) => saveImage(file, taskId));
//     // Inserta las imágenes asociadas a la tarea
//     if (images && images.length > 0) {
//       const insertImageQuery = 'INSERT INTO image (task_id, image_path) VALUES ($1, $2)';
//       for (const newPath of images) {
//         await pool.query(insertImageQuery, [taskId, newPath]);
//       }
//     }

//     res.status(201).json({
//       message: 'Task created successfully',
//       task: result.rows[0]
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// Se encarga de renombrar el archivo (fieldname) por el nombre original con la que es subido (originalname)
/* function saveImage(file, taskId) {
  const originalName = {
    imgName: file.originalname.split(".")[0],
    imgExtension: file.originalname.split(".")[1]
  }
  const nameImgWithId = `${originalName.imgName}_${taskId}.${originalName.imgExtension}`;
  const newPath = path.join(__dirname, `../../public/${nameImgWithId}`);
  fs.renameSync(file.path, newPath);
  return nameImgWithId;
} */


// Exportamos un objeto de exportaciones debido a que no solo será un modulo.
module.exports = {
  getAllTasks: getAllTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask
};
