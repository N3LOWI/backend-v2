const express = require('express');

const router = express.Router()

module.exports = router;



//Post Method
router.post('/postProfe', async (req, res) => {
    const data2 = new ModelProfe({
        //here to edit registros
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni
    })

    try {
        const dataToSave = await data2.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

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





const ModelProfe = require('../model/model-profe');

router.post('/post', (req, res) => {
    const data = new ModelProfe({
        name: req.body.name,
        age: req.body.age
    })
})