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
    }
});

module.exports = mongoose.model('data5', cursoSchema);
