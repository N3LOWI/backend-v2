const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router()
const User = require("../model/model-user");
const Alumno = require("../model/model-alum");
module.exports = router;



//Post Method
router.post('/postAlum', async (req, res) => {
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
            rol: 'alumno'
        });
        const savedUser = await newUser.save();

        const newAlumno = new Alumno({
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            usuario: savedUser._id
        });

        const savedAlumno = await newAlumno.save();

        // Actualizar el usuario con la referencia al alumno
        savedUser.refId = savedAlumno._id;
        await savedUser.save();

        res.json(savedAlumno);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

//Get all Method
router.get('/getAlumAll', async (req, res) => {
    try {
        const data = await ModelAlum.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID Method
router.get('/getAlum/:id', async (req, res) => {
    try {
        const data = await ModelAlum.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by ID Method
router.patch('/patchAlum/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = {};

        for (const key of Object.keys(req.body)) {
            if (req.body[key] !== '') {
                updates[key] = req.body[key];
            }
        }

        const options = { new: true };
        const result = await ModelAlum.findByIdAndUpdate(id, updates, options);

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/deleteAlum/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await ModelAlum.findByIdAndDelete(id)
        res.send(`El alumno ${data.nombre} ha sido eliminado de la base de datos.`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

const ModelAlum = require('../model/model-alum');