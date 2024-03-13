/* 
    Archivo de configuracion para guardar variables de entorno o constantes que luego reutilizaremos, 
    conexion hacia la base de datos 
*/

const { config } = require('dotenv'); // modulo para utilizar variables de entorno
config();


module.exports = {
  db: {
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
  }
}