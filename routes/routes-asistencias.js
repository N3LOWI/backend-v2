const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Asistencia = require("../model/model-asistencia-asignatura");

// Obtener todas las asistencias
router.get('/asistencias', async (req, res) => {
    try {
        const asistencias = await Asistencia.find().populate('registros.alumno registros.asignatura');
        res.json(asistencias);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Obtener la asistencia para una asignatura en particular
router.get('/asistencias/:asignaturaId', async (req, res) => {
    try {
        const asistencia = await Asistencia.findOne({ asignatura: req.params.asignaturaId }).populate('registros.alumno');
        res.json(asistencia);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Registrar una nueva asistencia
router.post('/asistencias', async (req, res) => {
    try {
        const { subject, date, hour, attendance } = req.body;
        const asistencia = new Asistencia({
            asignatura: mongoose.Types.ObjectId(subject),
            registros: Object.keys(attendance).map(alumnoId => ({
                alumno: mongoose.Types.ObjectId(alumnoId),
                faltas: [{
                    fecha: new Date(date),
                    hora: hour,
                    asistio: attendance[alumnoId]
                }],
            })),
        });
        const savedAsistencia = await asistencia.save();
        res.json(savedAsistencia);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
