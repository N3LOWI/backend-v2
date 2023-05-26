const mongoose = require('mongoose');

const notiSchema = new mongoose.Schema({
    titulo: {
        required: true,
        type: String,
        maxlength: 40
    },
    imagen: {
        required: false,
        type: String,
    },
    
    cuerpo: {
        required: true,
        type: String
    },
    fecha: {
        required: true,
        type: Date
    },
    autor: {
        required: true,
        type: String,
        maxlength: 40
    }
});

module.exports = mongoose.model('data6', notiSchema);

