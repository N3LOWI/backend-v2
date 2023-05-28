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

// Endpoint GET /api/subjects
router.get('/subjects', (req, res) => {
    // Simulación de los subjects obtenidos desde una base de datos o cualquier otra fuente de datos
    const subjects = ['Matemáticas', 'Física'];
  
    res.json(subjects);
});

// Endpoint para obtener estudiantes por materia y profesor
router.get('/students/:teacherId/:subject', async (req, res) => {
    const { teacherId, subject } = req.params;
  
    // Datos de ejemplo para pruebas
    const mockData = [
      {
        "id": "student1",
        "name": "John",
        "surname": "Doe",
        "className": "1A",
        "attendancePercentage": 0.9
      },
      {
        "id": "student2",
        "name": "Jane",
        "surname": "Smith",
        "className": "1A",
        "attendancePercentage": 0.1
      },
    ];
  
    res.json(mockData);
});

// Endpoint para obtener clases por materia y profesor
router.get('/classes/:teacherId/:subject', async (req, res) => {
    const { teacherId, subject } = req.params;
  
    // Datos de ejemplo para pruebas
    const mockData = [
    {
        "id": "1",
        "date": "2023-05-14",
        "attendancePercentage": 0.85
    },
    {
        "id": "2",
        "date": "2023-05-13",
        "attendancePercentage": 0.95
    },
    ];
  
    res.json(mockData);
});
  

const ModelProfe = require('../model/model-profe');