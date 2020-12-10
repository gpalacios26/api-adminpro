const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = (req, res = response, next) => {

    // Leer el token
    const token = req.header('x-token');

    if (!token) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next();

    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
}

const validarADMIN_ROLE = async (req, res = response, next) => {

    const uid = req.uid;

    try {
        const usuarioDb = await Usuario.findById(uid);

        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        if (usuarioDb.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'El usuario no tiene los privilegios necesarios'
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador'
        });
    }
}

const validarADMIN_ROLE_O_MismoUsuario = async (req, res = response, next) => {

    const uid = req.uid;
    const id = req.params.id;

    try {
        const usuarioDb = await Usuario.findById(uid);

        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        if (usuarioDb.role === 'ADMIN_ROLE' || uid === id) {

            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'El usuario no tiene los privilegios necesarios'
            });
        }

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador'
        });
    }
}

module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_O_MismoUsuario
}