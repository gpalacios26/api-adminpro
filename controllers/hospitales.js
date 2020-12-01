const { response } = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find().populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales: hospitales
    });
}

const crearHospital = async (req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {
        const hospitalDb = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDb
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const actualizarHospital = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        const hospitalDb = await Hospital.findById(id);
        if (!hospitalDb) {
            res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            });
        }

        const hospitalCambios = {
            usuario: uid,
            ...req.body
        };

        // Actualizar hospital
        const hospitalAct = await Hospital.findByIdAndUpdate(id, hospitalCambios, { new: true });

        res.json({
            ok: true,
            hospital: hospitalAct
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const borrarHospital = async (req, res = response) => {

    const id = req.params.id;

    try {
        const hospitalDb = await Hospital.findById(id);
        if (!hospitalDb) {
            res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            });
        }

        // Eliminar hospital
        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospital eliminado correctamente'
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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}