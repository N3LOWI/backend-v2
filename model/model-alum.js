const mongoose = require('mongoose');

const AlumSchema = new mongoose.Schema({
    nombre: {
        required: true,
        type: String,
        maxlength: 40
    },
    apellido: {
        required: true,
        type: String,
        maxlength: 40
    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curso', // referencia a un documento de curso
        required: false
    },
    dni: {
        required: true,
        type: String,
        minlength: 9,
        maxlength: 9
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', // referencia al documento de usuario
        required: true
    }
})

module.exports = mongoose.model('Alumno', AlumSchema)