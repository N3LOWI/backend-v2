const express = require('express');

const router = express.Router()

module.exports = router;



//Post Method
router.post('/postNoti', async (req, res) => {
    const data = new ModelCiclo({
        titulo: req.body.titulo,
        imagen: req.body.imagen,
        cuerpo: req.body.cuerpo,
        fecha: req.body.fecha,
        autor: req.body.autor,
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
router.get('/getNotiAll', async (req, res) => {
    try {
        const data = await ModelCiclo.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID Method
router.get('/getNoti/:id', async (req, res) => {
    try {
        const data = await ModelCiclo.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by ID Method
router.patch('/patchNoti/:id', async (req, res) => {
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
router.delete('/deleteNoti/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await ModelCiclo.findByIdAndDelete(id)
        res.send(`La noticia ${data.nombre} ha sido eliminada de la base de datos.`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})





const ModelCiclo = require('../model/model-noti');