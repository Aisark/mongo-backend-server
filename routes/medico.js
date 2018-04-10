var express = require('express');

var mAutentication = require('../middlewares/autenticacion');

var app = express();

// Modelos
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

// Petición GET
app.get('/', (req, res) => {

    var range = req.query.range || 0;
    range = Number(range);

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(range)
        .limit(5)
        .exec((err, medicos) => {
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
                    medicos: medicos
                });
            });
        })
})

// Petición POST: Crear Hospital
app.post('/', mAutentication.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error en el server'
            });
        }

        res.status(201).json({
            ok: true,
            medico: medico
        });
    });

});

// Petición PUT: Actualizar Hospital
app.put('/:id', mAutentication.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, hospital) => {
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
                message: 'El medico no existe',
                errors: { message: 'Medico no se encuentra en la BD' }
            });
        }
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital

        medico.save((err, medico) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar datos',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medico
            });
        });
    });
});

// Petición DELETE: Borrar Hospital
app.delete('/:id', mAutentication.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medico) => {
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
            medico: medico
        });
    });
});


module.exports = app;