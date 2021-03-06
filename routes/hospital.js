var express = require('express');

var mAutentication = require('../middlewares/autenticacion');

var app = express();

// Modelos
var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');

// Petición GET
app.get('/', (req, res) => {

    var range = req.query.range || 0;
    range = Number(range);

    Hospital.find({})
        .populate('usuario', 'nombre email')
        .skip(range)
        .limit(5)
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al cargar los datos del server',
                    errors: err
                });
            }
            Hospital.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    count: count,
                    hospitales: hospitales
                });
            });
        })
})

// Petición POST: Crear Hospital
app.post('/', mAutentication.verificaToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error en el server'
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospital
        });
    });

});

// Petición PUT: Actualizar Hospital
app.put('/:id', mAutentication.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error en el server',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'El hospital no existe',
                errors: { message: 'Hospital no se encuentra en la BD' }
            });
        }
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospital) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar datos',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospital
            });
        });
    });
});

// Petición DELETE: Borrar Hospital
app.delete('/:id', mAutentication.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospital) => {
        if (err) {
            // Error 500 en la BD
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el hospital',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: hospital
        });
    });
});


module.exports = app;