/* Archivo para almacenar la conexion hacia la base de datos */

const { Pool } = require('pg'); //importamos el modulo de pg que instalamos con npm

const pool = new Pool({ // instanciamos la clase que requiere pasarle parametros de configuracion de postgreSQL y devuelve un objeto de conexion que permitira hacer consultas
    user:'postgres', // usuario de postgreSQL
    password:'root', //contrasenia de postgreSQL
    host: 'localhost', //donde esta corriendo la bd
    port: 5432, //puerto por defecto
    database: 'tasksdb' // nombre de la BD
})

module.exports = pool;