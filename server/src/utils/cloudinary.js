const stream = require('stream');
const { cloudinary } = require('../config');


async function saveImageToCloudinary(file, taskId) {
  try {
    return new Promise((resolve, reject) => {
      // Creacion de un stream de subida a cloudinary (Es el destino al que se envian los datos y debe estar escuchando)
      // Creo el id y a que carpeta ira la img en cloudinary
      const uploadStream = cloudinary.uploader.upload_stream({ // upload_stream le dice a cloudinary que se usara fragmentos o streams para la subida de datos
        public_id: `task_${taskId}_${file.originalname.split(".")[0]}`, // Id para cada imagen
        folder: "task" // Carpeta en clodinary
      }, (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(result.secure_url); // Solo se llama a result cuando la subida a cloudinary se completó
        }
      });


      // Se crea los datos de la imagen almacenados en memoria y recien los pasa a cloudinary
      const bufferStream = new stream.PassThrough(); // Crea un buffer stream
      bufferStream.end(file.buffer); // Envia los datos del archivo al buffer stream (file.buffer contiene solo los datos de la imagen)
      bufferStream.pipe(uploadStream); // Pasa el buffer stream (fuente) al upload stream de Cloudinary (destino o variable "uploadStream")
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

async function deleteImageFromCloudinary(id) {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(id, (error, result) => {
        if(error){
          console.log(error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    })
  } catch (error) {
    console.log('Error deleting from Cloudinary', error);
    throw error;
  }
}

module.exports = {
  saveImageToCloudinary,
  deleteImageFromCloudinary
};