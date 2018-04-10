// Requirements
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Iniciando constiables
const app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes = require('./routes/login');
const hospitalRoutes = require('./routes/hospital');
const medicoRoutes = require('./routes/medico');
const busquedaRoutes = require('./routes/busqueda');
const uploadRoutes = require('./routes/upload');
const imagenesRoutes = require('./routes/imagenes');

// Conección a la BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos conectada');
});

// Rutas
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/medico', medicoRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/upload', uploadRoutes)
app.use('/busuqeda', busquedaRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);

// Escuchar puerto
app.listen(3000, () => {
    console.log('Express server corriendo en el puerto 3000');
});