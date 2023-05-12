const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());

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

app.use('/api', routesAlum);
app.use('/api', routesProfe);

app.use(cors());

