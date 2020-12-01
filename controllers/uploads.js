const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = async (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    // Validar el tipo
    const tiposValidos = ['usuarios', 'hospitales', 'medicos'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un tipo válido (usuarios, hospitales, medicos)'
        });
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo adjunto'
        });
    }

    // Procesar la imagen
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar la extensión
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión válida (png, jpg, jpeg, gif)'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                ok: false,
                msg: 'Error al subir la imagen'
            });
        }

        // Actualizar la imagen
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo: nombreArchivo
        });
    });
}

const retornaImagen = async (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImagen = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // Verificar si existe
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        const pathImagen = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImagen);
    }
}

module.exports = {
    fileUpload,
    retornaImagen
}