const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

const getUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
            .skip(desde).limit(5),

        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios: usuarios,
        total: total
    });
}

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar usuario
        await usuario.save();

        // Generar el token
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario: usuario,
            token: token,
            menu: getMenuFrontEnd(usuario.role)
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const actualizarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDb = await Usuario.findById(uid);
        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        // Actualizar usuario
        const { password, google, email, ...campos } = req.body;

        if (usuarioDb.email !== email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        if (!usuarioDb.google) {
            campos.email = email;
        } else if (usuarioDb.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de google, no puede cambiar su correo'
            });
        }

        const usuarioAct = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioAct
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const borrarUsuarios = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDb = await Usuario.findById(uid);
        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        // Eliminar usuario
        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado correctamente'
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
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuarios
}