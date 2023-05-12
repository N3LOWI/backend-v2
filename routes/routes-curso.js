const express = require('express');

const router = express.Router()

module.exports = router;



//Post Method
router.post('/postCurso', async (req, res) => {
    const data = new ModelCiclo({
        //here to edit registros
        nombre: req.body.nombre,
        codigo: req.body.codigo
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
router.get('/getCursoAll', async (req, res) => {
    try {
        const data = await ModelCiclo.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID Method
router.get('/getCurso/:id', async (req, res) => {
    try {
        const data = await ModelCiclo.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by ID Method
router.patch('/patchCurso/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = {};

        for (const key of Object.keys(req.body)) {
            if (req.body[key] !== '') {
                updates[key] = req.body[key];
            }
        }

        const options = { new: true };
        const result = await ModelCiclo.findByIdAndUpdate(id, updates, options);

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/deleteCurso/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await ModelCiclo.findByIdAndDelete(id)
        res.send(`El curso ${data.nombre} ha sido eliminado de la base de datos.`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})





const ModelCiclo = require('../model/model-curso');