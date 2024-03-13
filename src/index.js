/* Archivo que arranca el servidor */
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

const PORT = 4000;
app.listen(PORT);
console.log(`Server on port ${PORT}`);