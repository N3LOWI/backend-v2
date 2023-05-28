const express = require('express');

const router = express.Router();
const Asignatura = require("../model/model-asig");
const Profesor = require("../model/model-profe");
module.exports = router;



//Post Method
router.post('/postAsig', async (req, res) => {
    const data = new ModelCiclo({
        nombre: req.body.nombre,
        codigo: req.body.codigo,
        horas: req.body.horas
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
router.get('/getAsigAll', async (req, res) => {
    try {
        const data = await ModelCiclo.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID Method
router.get('/getAsig/:id', async (req, res) => {
    try {
        const data = await ModelCiclo.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Update by ID Method
router.patch('/patchAsig/:id', async (req, res) => {
    console.log(req.body)
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

        // Verificar si el campo 'profesor' ha sido actualizado
        if (updates.profesor) {
            // Obtener los IDs de las asignaturas que tenían al profesor anterior
            const asignaturas = await Asignatura.find({ profesor: updates.profesor });
            const asignaturasIds = asignaturas.map(asignatura => asignatura._id);

            // Actualizar las asignaturas con el nuevo profesor
            await Profesor.findByIdAndUpdate(updates.profesor, { asignaturas: asignaturasIds });
        }

        // Actualizar el profesor con los cambios en 'updates'
        await ModelCiclo.findByIdAndUpdate(id, updates, options);

        res.send(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


//Delete by ID Method
router.delete('/deleteAsig/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await ModelCiclo.findByIdAndDelete(id)
        res.send(`La asignatura ${data.nombre} ha sido eliminada de la base de datos.`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})





const ModelCiclo = require('../model/model-asig');