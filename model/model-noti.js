const mongoose = require('mongoose');

const notiSchema = new mongoose.Schema({
    titulo: {
        required: true,
        type: String,
        maxlength: 40
    },
    imagen: {
        required: false,
        type: Buffer,
        validate: {
            validator: function (value) {
                // Check if value is empty (no buffer)
                if (!value || !Buffer.isBuffer(value)) {
                    return true; // Accept empty field
                }
    
                // Check if the image is in JPEG format
                const jpegSignature = Buffer.from([0xff, 0xd8, 0xff]);
                if (!value.slice(0, 3).equals(jpegSignature)) {
                    return false;
                }
    
                // Check if the image size is less than or equal to 10MB
                const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                if (value.length > maxSize) {
                    return false;
                }
    
                return true;
            },
            message: 'The image must be in JPEG format and not exceed 10MB.'
        }
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

