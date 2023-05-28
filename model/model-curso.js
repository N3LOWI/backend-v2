const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
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
    asignaturas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asignatura' // referencia a documentos de asignaturas
    }]
});

module.exports = mongoose.model('Curso', cursoSchema);
