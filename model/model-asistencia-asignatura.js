const mongoose = require('mongoose');

const AsistenciaPorAsignaturaSchema = new mongoose.Schema({
    asignatura: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asignatura',
        required: true,
        unique: true,
    },
    registros: [{
        alumno: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Alumno',
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

module.exports = mongoose.model('AsistenciaPorAsignatura', AsistenciaPorAsignaturaSchema);
