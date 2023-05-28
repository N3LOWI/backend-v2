const mongoose = require('mongoose');

const AsistenciaPorClaseSchema = new mongoose.Schema({
    asignatura: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asignatura',
        required: true,
    },
    hora: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
    },
    registros: [{
        alumno: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Alumno',
            required: true
        },
        asistio: {
            type: Number,
            default: false
        }
    }]
});

// Define el índice compuesto en asignatura, hora y fecha
AsistenciaPorClaseSchema.index({ asignatura: 1, hora: 1, fecha: 1 }, { unique: true });


module.exports = mongoose.model('AsistenciaPorClase', AsistenciaPorClaseSchema);
