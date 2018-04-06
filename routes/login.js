var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

// Models BD
var Usuario = require('../models/usuario');


app.post('/', (req, res) => {

    var body = req.body
    Usuario.findOne({ email: body.email }, (err, usuario) => {
        if (err) {
            // Error 500 en la BD
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credeciales erroneas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Password erroneas',
                errors: err
            });
        }
        usuario.password = 'te la creiste wex';
        // Token JWT
        var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 1440 });

        res.status(200).json({
            ok: true,
            usuario: usuario,
            id: usuario._id,
            token: token
        });

    });

});









module.exports = app;