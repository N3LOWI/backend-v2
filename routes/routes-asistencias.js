const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Asistencia = require("../model/model-asistencia-asignatura");
const AsistenciaPorClase = require("../model/model-asistencia-clase");
const AsistenciaPorAlumno = require("../model/model-asistencia-alumno");
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
    const asistencia = await AsistenciaPorClase.findOne({ asignatura: subject, fecha: new Date(date), hora: hour });

    if (!asistencia) {
      // Si no existe una asistencia para la asignatura, crear una nueva
      const nuevaAsistencia = new AsistenciaPorClase({
        asignatura: mongoose.Types.ObjectId(subject),
        hora: hour,
        fecha: new Date(date),
        registros: Object.keys(attendance).map(alumnoId => ({
          alumno: mongoose.Types.ObjectId(alumnoId),
          asistio: attendance[alumnoId]
        })),
      });

      const savedAsistencia = await nuevaAsistencia.save();

      for (const alumnoId of Object.keys(attendance)) {
        const asistenciaAlumno = await AsistenciaPorAlumno.findOne({ alumno: alumnoId });

        if (!asistenciaAlumno) {
          const nuevaAsistenciaAlumno = new AsistenciaPorAlumno({
            alumno: mongoose.Types.ObjectId(alumnoId),
            registros: [{
              asignatura: mongoose.Types.ObjectId(subject),
              presente: attendance[alumnoId] === 1 ? 1 : 0,
              faltasjustificadas: attendance[alumnoId] === 2 ? 1 : 0,
              faltas: attendance[alumnoId] === 3 ? 1 : 0
            }]
          });
          const savedAsistenciaAlumno = await nuevaAsistenciaAlumno.save();
        } else {
          const registroIndex = asistenciaAlumno.registros.findIndex(registro => registro.asignatura.toString() === subject);
          if (registroIndex === -1) {
            // No existe un registro para la asignatura, crear uno nuevo
            asistenciaAlumno.registros.push({
              asignatura: mongoose.Types.ObjectId(subject),
              presente: attendance[alumnoId] === 1 ? 1 : 0,
              faltasjustificadas: attendance[alumnoId] === 2 ? 1 : 0,
              faltas: attendance[alumnoId] === 3 ? 1 : 0
            });
          } else {
            // Actualizar el registro existente
            const presente = attendance[alumnoId] === 1 ? asistenciaAlumno.registros[registroIndex].presente + 1 : asistenciaAlumno.registros[registroIndex].presente;
            const faltasjustificadas = attendance[alumnoId] === 2 ? asistenciaAlumno.registros[registroIndex].faltasjustificadas + 1 : asistenciaAlumno.registros[registroIndex].faltasjustificadas;
            const faltas = attendance[alumnoId] === 3 ? asistenciaAlumno.registros[registroIndex].faltas + 1 : asistenciaAlumno.registros[registroIndex].faltas;

            asistenciaAlumno.registros[registroIndex].presente = presente;
            asistenciaAlumno.registros[registroIndex].faltasjustificadas = faltasjustificadas;
            asistenciaAlumno.registros[registroIndex].faltas = faltas;
          }

          const updatedAsistenciaAlumno = await asistenciaAlumno.save();
        }
      }

      res.json(savedAsistencia);
    } else {
      res.status(501).send('Ya existe una asistencia para la asignatura, fecha y hora especificadas');
    }
  } catch (err) {
    console.log(err);
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
      console.log(alumnosConSumaAsistencias);
      res.json(alumnosConSumaAsistencias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los estudiantes' });
    }
  });
  
// Endpoint para obtener clases por materia
router.get('/classes/:subjectId', async (req, res) => {
  const subjectId = req.params.subjectId;

  try {
    // Buscar el documento "asistencia" para el ID de asignatura especificado
    const asistencia = await AsistenciaPorClase.find({ asignatura: subjectId});

    if (!asistencia) {
      return res.status(404).json({ error: 'Asistencia no encontrada' });
    }

    res.json(asistencia);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener las clases' });
  }
});

// Endpoint para obtener clases por materia y profesor
router.get('/classes/:subjectId/:date/:time', async (req, res) => {
  const subjectId = req.params.subjectId;
  const dateParam = req.params.date;
  const time = req.params.time;
  
  // Convertir el parámetro de fecha en un objeto de fecha
  const date = new Date(dateParam);

  
  try {
    // Buscar el documento "asistencia" para el ID de asignatura especificado
    const asistencia = await Asistencia.findOne({ asignatura: subjectId }).populate('registros.alumno');

    if (!asistencia) {
      return res.status(404).json({ error: 'Asistencia no encontrada' });
    }
    
    // Obtener el objeto falta correspondiente a la fecha y hora especificadas
    const faltaObj = asistencia.registros.find((registro) => {
      const falta = registro.faltas.find((falta) => {
        const faltaDate = new Date(falta.fecha);
        const faltaTime = falta.hora;
        console.log(faltaDate, date);
        console.log(faltaDate.getTime() === date.getTime());
        return faltaDate.getTime() === date.getTime() && faltaTime === time;
      });
      return falta !== undefined;
    });
    
    if (!faltaObj) {
      return res.status(404).json({ error: 'Falta no encontrada' });
    }

    // Filtrar el objeto falta para obtener solo el usuario y el asistio
    const falta = faltaObj.faltas.find((falta) => {
      const faltaDate = new Date(falta.fecha);
      const faltaTime = falta.hora;
      return faltaDate.getTime() === date.getTime() && faltaTime === time;
    });
    
    const result = {
      usuario: faltaObj.alumno.nombre,
      asistio: falta.asistio
    };

    console.log(result);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener la clase' });
  }
});

// Endpoint para obtener las asistencias de un alumno
router.get('/student/attendance/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Buscar al usuario por su ID
    const usuario = await Usuario.findById(userId);
    console.log(usuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    console.log(usuario.refId);
    // Buscar AsistenciaPorAlumno por el campo refId del usuario
    const asistencias = await AsistenciaPorAlumno.find({ alumno: usuario.refId })
      .populate('registros.asignatura', 'nombre horas');

    console.log(asistencias);
    if (!asistencias) {
      return res.status(404).json({ error: 'Asistencias no encontradas' });
    }

    // Añadir la propiedad "horas" dentro de cada asignatura en los registros de asistencias
    asistencias.forEach(asistencia => {
      asistencia.registros.forEach(registro => {
        registro.asignatura = {
          ...registro.asignatura._doc,
          horas: registro.asignatura.horas
        };
      });
    });

    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las asistencias del alumno' });
  }
});



module.exports = router;




  

module.exports = router;
