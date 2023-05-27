const express = require('express');
const passport = require('passport');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router()
const User = require("../model/model-user");

module.exports = router;



router.post('/register', async (req, res) => {
    try {
      const { nombre, apellido, rol, email, password } = req.body;
  
      // Encriptar la contraseña
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({ nombre, apellido, rol, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Error al registrar el usuario' });
    }
  });
  

// Login and return a JWT
router.post("/login", passport.authenticate("local", { session: false }), (req, res) => {
    const payload = { id: req.user.id, email: req.user.email };
  
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ user: req.user, token});
      }
    });
});

// Update user information
router.put("/user/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
      const userId = req.params.id;
  
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
  
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

// Update user password
router.put("/user/:id/change-password", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
      const userId = req.params.id;
      const { oldPassword, newPassword } = req.body;
  
      // Verificar si se proporcionó la contraseña antigua
      if (!oldPassword) {
        return res.status(400).json({ error: "Old password is required" });
      }
  
      // Obtener el usuario de la base de datos
      const user = await User.findById(userId);
  
      // Verificar la contraseña antigua
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid old password" });
      }
  
      // Generar un nuevo hash de la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Actualizar la contraseña del usuario en la base de datos
      const updatedUser = await User.findByIdAndUpdate(userId, { password: newHashedPassword }, { new: true });
  
      if (updatedUser) {
        return res.status(200).json(updatedUser);
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
});
  
  

// Verify a JWT
router.get("/verify", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.status(200).json({ user: req.user, isValid: true });
  });