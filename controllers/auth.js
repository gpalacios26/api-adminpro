const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

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
            token: token,
            menu: getMenuFrontEnd(usuarioDb.role)
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {
        const { name, email, picture } = await googleVerify(googleToken);

        // Verificar si el usuario existe
        const usuarioDb = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDb) {
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            usuario = usuarioDb;
            usuario.google = true;
        }

        // Guardar en base de datos
        await usuario.save();

        // Generar el token
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token: token,
            menu: getMenuFrontEnd(usuario.role)
        });

    } catch (error) {
        console.log(error);

        res.status(400).json({
            ok: false,
            msg: 'El token no es correcto'
        });
    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    // Obtener usuario por uid
    const usuarioDb = await Usuario.findById(uid);
    if (!usuarioDb) {
        return res.status(404).json({
            ok: false,
            msg: 'No existe un usuario con ese id'
        });
    }

    // Generar el token
    const token = await generarJWT(uid);

    res.json({
        ok: true,
        token: token,
        usuario: usuarioDb,
        menu: getMenuFrontEnd(usuarioDb.role)
    });
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}