/* Archivo para almacenar la conexion hacia la base de datos */

const { Pool } = require('pg'); //importamos el modulo de pg que instalamos con npm
const { db } = require('./config');


const pool = new Pool({ // instanciamos la clase que requiere pasarle parametros de configuracion de postgreSQL y devuelve un objeto de conexion que permitira hacer consultas
    connectionString: db.urldatabase,
    ssl: {
        rejectUnauthorized: false
    }
})

module.exports = pool;