const express = require ('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');

const sauceRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

require('dotenv').config();
mongoose.connect(process.env.URL_DB_CONNECT,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((erreur) => console.log('erreur', erreur));

const app = express();
// on intersepte tout les requettes qui contienne du JSON et on met a disposition le contenue de la requettte sur l'objet requête dans req.body
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //l'origine qui a le droit d'acceder a n otre API est pour tout le monde 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //Utilisation d'utiliser certain en-têtê
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')//Uilisation de certaine méthode 
    next(); // Pour passer l'execution au middleware d'apres 
  });

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;