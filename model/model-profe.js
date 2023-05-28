const mongoose = require('mongoose');

const profeSchema = new mongoose.Schema({
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
    dni: {
        required: true,
        type: String,
        minlength: 9,
        maxlength: 9
    },
    asignaturas: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Asignatura' }] // Define un arreglo de referencias a asignaturas
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', // referencia al documento de usuario
        required: true
    }
});

module.exports = mongoose.model('Profesor', profeSchema);
