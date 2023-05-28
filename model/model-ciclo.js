const mongoose = require('mongoose');

const cicloSchema = new mongoose.Schema({
    nombre: {
        required: true,
        type: String,
    },
    codigo: {
        required: true,
        type: String,
        maxlength: 20
    },
    cursos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curso' // referencia a documentos de cursos
    }]
});

module.exports = mongoose.model('Ciclo', cicloSchema);
