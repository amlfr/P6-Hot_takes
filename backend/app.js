/* Importing express, a body parser for the requests, path for working with images and mongoose to set up */

const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const path = require('path');

/* Importing the differents routes of the API */

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce')

/* Connecting to the mongoDB database,  TODO use env variable folder  */

mongoose.connect('mongodb+srv://amlfr:8D3JogBCGhDi7AkI@cluster0.lddpcur.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

/* Creating the  express application */

const app = express();

/* Allowing cross origin requests */

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/* Using the bodyparser for the requests coming */

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

/* Setting up the routes for the applications */

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

/* Exporting the application */

module.exports = app;