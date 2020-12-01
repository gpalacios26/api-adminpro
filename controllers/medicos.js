const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {

    const medicos = await Medico.find().populate('usuario', 'nombre img').populate('hospital', 'nombre');

    res.json({
        ok: true,
        medicos: medicos
    });
}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {
        const medicoDb = await medico.save();

        res.json({
            ok: true,
            medico: medicoDb
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const actualizarMedico = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        const medicoDb = await Medico.findById(id);
        if (!medicoDb) {
            res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado'
            });
        }

        const medicoCambios = {
            usuario: uid,
            ...req.body
        };

        // Actualizar médico
        const medicoAct = await Medico.findByIdAndUpdate(id, medicoCambios, { new: true });

        res.json({
            ok: true,
            medico: medicoAct
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const borrarMedico = async (req, res = response) => {

    const id = req.params.id;

    try {
        const medicoDb = await Medico.findById(id);
        if (!medicoDb) {
            res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado'
            });
        }

        // Eliminar médico
        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Médico eliminado correctamente'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}