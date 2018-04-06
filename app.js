// Requirements
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Iniciando variables
var app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// Conección a la BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos conectada');
});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Escuchar puerto
app.listen(3000, () => {
    console.log('Express server corriendo en el puerto 3000');
});