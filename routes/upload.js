import { userInfo } from 'os';

const express = require('express');
const fileUpload = require('express-fileupload')
    // Para borrar archivos
const fs = require('fs');

const app = express();


// Modelos
const Usuario = require('../models/usuario');

// Implementar middleware para subir archivos
app.use(fileUpload());

// Rutas
app.put('/:tipo/:id', (req, res) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de coleccion
    var colecciones = ['medicos', 'hospitales', 'usuarios'];
    if (colecciones.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Tipo de collecion no valida'
        });
    }

    if (!req.files) {
        return res.status(500).json({
            ok: false,
            message: 'Error al encontrar archivos'
        });
    }

    // Obtener el nombre del archivo, algoritmo por mejorar
    var archivo = req.files.imagen;
    var nombreCut = archivo.name.split('.');
    var extension = nombreCut[nombreCut.length - 1]

    // Solo estas extenciones se validan
    var extesiones = ['png', 'jpg', 'gif', 'jpeg'];

    if (extesiones.indexOf(extension) < 0) {
        return res.status(500).json({
            ok: false,
            message: 'Extensión no valida'
        });
    }

    // Nombre de archivo personalizado
    var nameFile = `${ id }-${ new Date().getMilliseconds()}.${ extension }`

    // PAth para mover el archivo del temp a carpeta
    var path = `./uploads/${tipo}/${nameFile}`

    // Mover el archivo a otra carpeta con nuevo nombre
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al mover archivo',
                errors: err
            });
        }

        uploadByType(tipo, id, nameFile, res);

    });


});

function uploadByType(tipo, id, name, res) {
    if (tipo = 'usuario') {
        Usuario.findById(id, (err, usuario) => {
            // Poner validación a rr

            var oldName = usuario.img;

            if (fs.existsSync(oldName)) {
                fs.unlink(oldName);
            }

            usuario.img = name;
            usuario.save((err, newusuario) => {
                // Validar error

                return res.status(200).json({
                    ok: true,
                    usuario: newusuario
                });
            })

        })
    }
}

module.exports = app;