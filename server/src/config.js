/* 
    Archivo de configuracion para guardar variables de entorno o constantes que luego reutilizaremos, 
    conexion hacia la base de datos 
*/

const { config } = require('dotenv'); // modulo para utilizar variables de entorno
config();

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
  db: {
    urldatabase: process.env.DATABASE_URL,
  },
  cloudinary
}