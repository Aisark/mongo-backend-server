var express = require('express');

var app = express();

// Modelos
var Hospitales = require('../models/hospital');
var Medicos = require('../models/medico');
var Usuarios = require('../models/usuario')

// Busqueda Especifica
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var promise;

    switch (tabla) {
        case 'medico':
            promise = buscarMedicos(busqueda, regex);
            break;
        case 'hospital':
            promise = buscarHospitales(busqueda, regex);
            break;
        case 'usuario':
            promise = buscarUsuarios(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'Coleccion no valida'
            })
    }

    promise.then(busqueda => {
        res.status(200).json({
            ok: true,
            [tabla]: busqueda
        });
    });

});

// Busqueda general
app.get('/todo/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;

    var regex = new RegExp(busqueda, 'i')

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ]).then(respuestas => {

        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    })

});

// Todavia no se las ha puesto un limite a la busqueda
function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospitales.find({ nombre: regex }, (err, hospitales) => {
            if (err) reject('Error al cargar hospitales', err)
            resolve(hospitales);
        });
    });
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medicos.find({ nombre: regex }, (err, medicos) => {
            if (err) reject('Error al cargar medicos', err)
            resolve(medicos);
        });
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuarios.find()
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) reject('Error al cargar usuarios', err)
                resolve(usuarios);
            });
    });
}


module.exports = app;