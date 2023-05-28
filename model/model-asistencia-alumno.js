const mongoose = require('mongoose');

const AsistenciaPorAlumnoSchema = new mongoose.Schema({
    alumno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumno',
        unique: true,
        required: true
    },
    registros: [{
        asignatura: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Asignatura',
            required: true
        },
        presente: {
            type: Number
        },
        faltasjustificadas: {
            type: Number
        },
        faltas: {
            type: Number
        },
    }]
});

module.exports = mongoose.model('AsistenciaPorAlumno', AsistenciaPorAlumnoSchema);
