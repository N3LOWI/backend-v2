const express = require('express');
const router = express.Router();

router.post('/postProfe', async (req, res) => {
    try {
        const { nombre, apellido, dni, email } = req.body;

        // Generar una contraseña de ejemplo
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // Crear un nuevo usuario
        const newUser = new User({
            nombre: nombre,
            apellido: apellido,
            email: email,
            password: hashedPassword,
            rol: 'teacher'
        });

        const savedUser = await newUser.save();

        // Crear un nuevo profesor con referencia al usuario
        const newProfesor = new Profesor({
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            usuario: savedUser._id
        });

        const savedProfesor = await newProfesor.save();

        // Actualizar el usuario con la referencia al Profesor
        savedUser.refId = savedProfesor._id;
        await savedUser.save();

        res.json(savedProfesor);
    } catch (err) {
        res.status(500).send(err);
    }
});

//Get all Method
router.get('/getProfeAll', async (req, res) => {
    try {
        const data = await ModelProfe.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID Method
router.get('/getProfe/:id', async (req, res) => {
    try {
        const data = await ModelProfe.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by ID Method
router.patch('/patchProfe/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = {};

        for (const key of Object.keys(req.body)) {
            if (req.body[key] !== '') {
                updates[key] = req.body[key];
            }
        }

        const options = { new: true };
        const result = await ModelProfe.findByIdAndUpdate(id, updates, options);

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/deleteProfe/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await ModelProfe.findByIdAndDelete(id)
        res.send(`El profesor ${data.nombre} ha sido eliminado de la base de datos.`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
  
module.exports = router;
const ModelProfe = require('../model/model-profe');