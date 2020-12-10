/*
 Ruta: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_O_MismoUsuario } = require('../middlewares/validar-jwt');

const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuarios } = require('../controllers/usuarios');

const router = Router();

router.get('/', validarJWT, getUsuarios);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], crearUsuario);

router.put('/:id', [
    validarJWT,
    validarADMIN_ROLE_O_MismoUsuario,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
], actualizarUsuario);

router.delete('/:id', [validarJWT, validarADMIN_ROLE], borrarUsuarios);

module.exports = router;
