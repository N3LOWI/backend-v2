const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: {
      type: String,
      required: true
    },
    apellido: {
      type: String,
      required: true
    },
    rol: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId, // Referencia al documento de alumno o profesor
      required: false // No es requerido porque no sabrás el ID hasta que el alumno o profesor sea creado
    }
  });
  

const User = mongoose.model('Usuario', userSchema);

module.exports = User;
