require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require("passport");

const app = express();

//Allow CORS from any website
app.use(cors({
    origin: '*'
}));


app.use(express.json());
app.use(passport.initialize());

// Passport configuration
require("./config/passport")(passport);

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})

require('dotenv').config();

const mongoString = process.env.DATABASE_URL

//random
mongoose.set('strictQuery', false);
//random
mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('DATABASE CONNECTED !!!');
})


const routesAlum = require('./routes/routes-alum');
const routesProfe = require('./routes/routes-profe');
const routesCiclo = require('./routes/routes-ciclo');
const routesAsig = require('./routes/routes-asig');
const routesCurso = require('./routes/routes-curso');
const routesNoti = require('./routes/routes-noti');
const routesUser = require('./routes/routes-user');

app.use('/api', routesAlum);
app.use('/api', routesProfe);
app.use('/api', routesCiclo);
app.use('/api', routesAsig);
app.use('/api', routesCurso);
app.use('/api', routesNoti);
app.use('/api', routesUser);