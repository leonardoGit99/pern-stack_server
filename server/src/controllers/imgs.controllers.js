const pool = require('../db');
const fs = require('node:fs');

const createImg = async (req, res) => {
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
}


module.exports = {
  createImg,
  createImgs,
}