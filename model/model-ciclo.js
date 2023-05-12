const mongoose = require('mongoose');

const cicloSchema = new mongoose.Schema({
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

module.exports = mongoose.model('data3', cicloSchema);
