const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.json());
app.use(cors());
////////////////////////////////////////////////////////////////////////////////////////////////

/**************************************************************************** */
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sachista:12345@cluster0.ljclkgv.mongodb.net/alumnistlab?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);
/**************************************************************************** */

app.post('/register', async (req, res) => {
  try {
    // Hash and salt the user's password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user object
    const user = new User({
      username: req.body.username,
      password: hashedPassword
    });

    // Save the user object to the database
    const newUser = await user.save();

    // Return a success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Return an error response
    res.status(500).json({ message: 'An error occurred while registering the user' });
  }
});













app.post('/login', async (req, res) => {
  try {
    // TODO: Retrieve the user object from a database based on the username

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if (passwordMatch) {
      // Create a JSON Web Token with the user's username as the payload
      const token = jwt.sign({ username: user.username }, 'secret');

      // Return the token in the response
      res.status(200).json({ token: token });
    } else {
      // Return an error response
      res.status(401).json({ message: 'idk' });
    }
  } catch (error) {
    // Return an error response
    res.status(500).json({ message: 'An error occurred while loging the user' });
  }
});





const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

