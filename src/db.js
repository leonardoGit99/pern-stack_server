/* Archivo para almacenar la conexion hacia la base de datos */

const { Pool } = require('pg'); //importamos el modulo de pg que instalamos con npm
const {db} = require('./config');


const pool = new Pool({ // instanciamos la clase que requiere pasarle parametros de configuracion de postgreSQL y devuelve un objeto de conexion que permitira hacer consultas
    user: db.user, // usuario de postgreSQL
    password: db.password, //contrasenia de postgreSQL
    host: db.host, //donde esta corriendo la bd
    port: db.port, //puerto por defecto
    database: db.database // nombre de la BD
})

module.exports = pool;