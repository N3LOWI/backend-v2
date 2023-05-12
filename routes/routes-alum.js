const express = require('express');

const router = express.Router()

module.exports = router;



//Post Method
router.post('/postAlum', async (req, res) => {
    const data = new ModelAlum({
        //here to edit registros
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

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
        /*
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )
        */

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

router.post('/post', (req, res) => {
    const data = new ModelAlum({
        name: req.body.name,
        age: req.body.age
    })
})