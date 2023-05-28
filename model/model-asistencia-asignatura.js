const mongoose = require('mongoose');

const AsistenciaPorAsignaturaSchema = new mongoose.Schema({
    asignatura: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asignatura',
        required: true
    },
    registros: [{
        alumno: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Alumno',
            required: true
        },
        faltas: [{
            fechaHora: {
                type: Date,
                required: true
            },
            asistio: {
                type: Boolean,
                default: false
            }
        }]
    }]
});

module.exports = mongoose.model('AsistenciaPorAsignatura', AsistenciaPorAsignaturaSchema);
