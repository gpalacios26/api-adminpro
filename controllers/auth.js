const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuarioDb = await Usuario.findOne({ email });
        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'Los datos de acceso no son válidos'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDb.password);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Los datos de acceso no son válidos'
            });
        }

        // Generar el token
        const token = await generarJWT(usuarioDb.id);

        res.json({
            ok: true,
            token: token
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

module.exports = {
    login
}