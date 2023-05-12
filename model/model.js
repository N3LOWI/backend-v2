const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
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
        maxlength: 9
    }
})

module.exports = mongoose.model('Data', dataSchema)