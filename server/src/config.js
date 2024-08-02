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
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
  },
  cloudinary
}