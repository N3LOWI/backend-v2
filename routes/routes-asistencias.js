const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Asistencia = require("../model/model-asistencia-asignatura");
const bcrypt = require("bcrypt");
const Asignatura = require("../model/model-asig");
const Profesor = require("../model/model-profe");
const Usuario = require("../model/model-user");
const Alumno = require("../model/model-alum");

// Obtener todas las asistencias
router.get('/asistencias', async (req, res) => {
    try {
        const asistencias = await Asistencia.find().populate('registros.alumno registros.asignatura');
        res.json(asistencias);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Obtener la asistencia para una asignatura en particular
router.get('/asistencias/:asignaturaId', async (req, res) => {
    try {
        const asistencia = await Asistencia.findOne({ asignatura: req.params.asignaturaId }).populate('registros.alumno');
        res.json(asistencia);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Registrar una nueva asistencia
router.post('/asistencias', async (req, res) => {
    try {
      const { subject, date, hour, attendance } = req.body;
      const asistencia = await Asistencia.findOne({ asignatura: subject });
  
      if (!asistencia) {
        // Si no existe una asistencia para la asignatura, crear una nueva
        const nuevaAsistencia = new Asistencia({
          asignatura: mongoose.Types.ObjectId(subject),
          registros: Object.keys(attendance).map(alumnoId => ({
            alumno: mongoose.Types.ObjectId(alumnoId),
            faltas: [{
              fecha: new Date(date),
              hora: hour,
              asistio: attendance[alumnoId]
            }],
          })),
        });
        const savedAsistencia = await nuevaAsistencia.save();
        res.json(savedAsistencia);
      } else {
        // Si la asistencia ya existe, agregar una nueva falta para el alumno correspondiente
        Object.keys(attendance).forEach(alumnoId => {
          const falta = {
            fecha: new Date(date),
            hora: hour,
            asistio: attendance[alumnoId]
          };
          const alumnoIndex = asistencia.registros.findIndex(registro => registro.alumno.toString() === alumnoId);
          if (alumnoIndex !== -1) {
            asistencia.registros[alumnoIndex].faltas.push(falta);
          } else {
            asistencia.registros.push({
              alumno: mongoose.Types.ObjectId(alumnoId),
              faltas: [falta],
            });
          }
        });
  
        const savedAsistencia = await asistencia.save();
        res.json(savedAsistencia);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });
  

// Endpoint GET /api/subjects/:id
router.get('/subjects/:id', async (req, res) => {
    const userId = req.params.id;
    try {
      // Buscar al usuario por su ID y obtener su campo refId
      const usuario = await Usuario.findById(userId);
  
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      const profesorId = usuario.refId;
  
      // Buscar al profesor por su ID y seleccionar solo las asignaturas
      const profesor = await Profesor.findById(profesorId).populate('asignaturas', ['_id', 'nombre']);
  
      if (!profesor) {
        return res.status(404).json({ error: 'Profesor no encontrado' });
      }
  
      // Obtener el ID y el nombre de las asignaturas del profesor
      const subjects = profesor.asignaturas.map(asignatura => ({
        id: asignatura._id,
        nombre: asignatura.nombre
      }));
  
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las asignaturas del profesor' });
    }
  });
  

// Endpoint para obtener estudiantes por materia y profesor
router.get('/students/:subject', async (req, res) => {
    const subjectId = req.params.subject;
  
    try {
      // Buscar la asignatura por su ID y obtener los alumnos asociados
      const asignatura = await Asignatura.findById(subjectId);
  
      if (!asignatura) {
        return res.status(404).json({ error: 'Asignatura no encontrada' });
      }
  
      const alumnosIds = asignatura.alumnos;
      const horasTotales = asignatura.horas; // Obtener las horas totales del módulo
  
      // Buscar los alumnos por sus IDs
      const alumnos = await Alumno.find({ _id: { $in: alumnosIds } });
  
      const alumnosConSumaAsistencias = await Promise.all(
        alumnos.map(async (alumno) => {
          const asistencias = await Asistencia.find({
            asignatura: subjectId,
            'registros.alumno': alumno._id,
            'registros.faltas.asistio': 3
          });
  
          const sumaAsistencias = asistencias.reduce((total, asistencia) => {
            const faltas = asistencia.registros.find(registro => registro.alumno.toString() === alumno._id.toString()).faltas;
            const suma = faltas.reduce((acumulador, falta) => {
              if (falta.asistio === 3) {
                return acumulador + 1;
              } else {
                return acumulador;
              }
            }, 0);
            return total + suma;
          }, 0);
  
          const porcentajeFaltas = (sumaAsistencias / horasTotales); // Calcular el porcentaje de faltas

          return { ...alumno.toObject(), porcentajeFaltas };
        })
      );
  
      res.json(alumnosConSumaAsistencias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los estudiantes' });
    }
  });
  
// Endpoint para obtener clases por materia y profesor
router.get('/classes/:subjectId', async (req, res) => {
    const subjectId = req.params.subjectId;
  
    try {
      // Buscar la asignatura por su ID
      const asignatura = await Asignatura.findById(subjectId);
  
      if (!asignatura) {
        return res.status(404).json({ error: 'Asignatura no encontrada' });
      }
  
      // Aquí puedes realizar la lógica necesaria para obtener las clases de la asignatura y el profesor correspondiente
      // Puedes usar los datos de ejemplo para pruebas o hacer consultas a tu base de datos u otra fuente de datos
      // Por ejemplo, puedes obtener las clases de una colección de "Clase" donde haya una referencia al profesor y a la asignatura
  
      // Datos de ejemplo para pruebas
      const mockData = [
        {
          id: '1',
          date: '2023-05-14',
          attendancePercentage: 0.85
        },
        {
          id: '2',
          date: '2023-05-13',
          attendancePercentage: 0.95
        },
      ];
  
      res.json(mockData);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las clases' });
    }
  });
  

module.exports = router;
