const mongoose = require('mongoose');
const Alumno = require("./model-alum");

const asigSchema = new mongoose.Schema({
    nombre: {
        required: true,
        type: String,
        maxlength: 40
    },
    codigo: {
        required: true,
        type: String,
        maxlength: 20
    },
    horas: {
        required: true,
        type: Number,
    },
    profesor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profesor', // referencia a un documento de profesor
        required: false
    },
    alumnos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumno' // referencia a documentos de alumnos
    }]
});

module.exports = mongoose.model('Asignatura', asigSchema);
