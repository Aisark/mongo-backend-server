var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mAutentication = require('../middlewares/autenticacion');

var app = express();

// Models BD
var Usuario = require('../models/usuario');

// Rutas con GET
/**
 * @description Obtener todos los usuarios por metodo GET
 */
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec((err, usuarios) => {
            if (err) {
                // Error 500 en la BD
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar usuarios',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        })


});

// Rutas con POST
app.post('/', mAutentication.verificaToken, (req, res) => {
    // Si body-parse no esta instalado no funciona
    var body = req.body

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    })

    usuario.save((err, usersave) => {
        if (err) {
            // Error 500 en la BD
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usersave,
            usuariotoken: req.usuario
        });
    });

});

// Rutas PUT
app.put('/:id', mAutentication.verificaToken, (req, res) => {
    var id = req.params.id
    var body = req.body

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el ' + id + ' no existe',
                errors: { message: 'No existe ese usuario' }
            });
        }
        usuario.nombre = body.nombre
        usuario.email = body.email
        usuario.role = body.role

        usuario.save((err, usarioSave) => {
            if (err) {
                // Error 400 en la BD
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usarioSave
            });
        });
    });

})

// Routes delete
app.delete('/:id', mAutentication.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioDelete) => {
        if (err) {
            // Error 500 en la BD
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar usuario',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioDelete
        });
    })
});

module.exports = app;