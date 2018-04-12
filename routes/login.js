const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');

const SEED = require('../config/config').SEED;
const GOOGLE_ID_CLIENTE = require('../config/config').GOOGLE_ID_CLIENTE;
const SECRET_ID = require('../config/config').SECRET_CLIENTE;

const app = express();

// Models BD
const Usuario = require('../models/usuario');

//Autenticación con API de Google
app.post('/google', (req, res) => {

    var token = req.body.token;

    const client = new OAuth2Client(GOOGLE_ID_CLIENTE, SECRET_ID);
    const ticket = client.verifyIdToken({
        idToken: token
    })

    ticket.then(data => {

        Usuario.findOne({ email: data.payload.email }, (err, user) => {
            if (err) {
                // Error 500 en la BD
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }

            if (user) {
                if (user.google === false) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Debe estar autenticado normalmente'
                    });
                } else {
                    user.password = 'te la creiste wex';
                    // Token JWT
                    var token = jwt.sign({ usuario: user }, SEED, { expiresIn: 1440 });

                    res.status(200).json({
                        ok: true,
                        usuario: user,
                        id: user._id,
                        token: token
                    });
                }
            } else {
                // Si el usuario no existe, se crea
                var usuario = new Usuario();
                usuario.nombre = data.payload.name;
                usuario.email = data.payload.email;
                usuario.img = data.payload.picture;
                usuario.google = true;
                usuario.password = 'no puesta :)'

                usuario.save((err, user) => {
                    var token = jwt.sign({ usuario: user }, SEED, { expiresIn: 1440 });

                    res.status(200).json({
                        ok: true,
                        usuario: user,
                        id: user._id,
                        token: token
                    });
                });
            }
        });
    }).catch(err => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Token no válido',
                errors: err
            });
        }
    });
});

// Autenticación normal
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