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
    }
});

module.exports = mongoose.model('data2', profeSchema);
