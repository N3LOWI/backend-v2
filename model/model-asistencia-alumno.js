const mongoose = require('mongoose');

const AsistenciaPorAlumnoSchema = new mongoose.Schema({
    alumno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumno',
        required: true
    },
    registros: [{
        asignatura: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Asignatura',
            required: true
        },
        faltas: [{
            fecha: {
                type: Date,
                required: true
            },
            hora: {
                type: String,
                required: true
            },
            asistio: {
                type: Number,
                default: false
            }
        }]
    }]
});

module.exports = mongoose.model('AsistenciaPorAlumno', AsistenciaPorAlumnoSchema);
