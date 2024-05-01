const pool = require('../db');
const fs = require('node:fs');

/* const createImg = async (req, res) => {
  console.log(req.file);
  saveImage(req.file);
  return res.send("Imagen subida");
}

const createImgs = async (req, res) => {
  req.files.map(saveImage);
  return res.send("Imagenes subidas");
}

function saveImage(file) { // Se encarga de renombrar el archivo (fieldname) por el nombre original con la que es subido (originalname)
  const newPath = `./uploads/${file.originalname}`;
  fs.renameSync(file.path, newPath);
  return newPath;
} */

const  getImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT t.task_id, ARRAY_AGG(i.image_path) AS image_paths FROM task t JOIN image i ON t.task_id = i.task_id WHERE t.task_id = $1 GROUP BY t.task_id',
      [id]                    
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Imgs not found" })
    }       
    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}




module.exports = {
  /* createImg,
  createImgs, */
  getImages
}