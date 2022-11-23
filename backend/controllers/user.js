const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();

const passwordValidator = require('password-validator');
// crée un schéma
const schemaPassword = new passwordValidator();
// ajouté des propriétés au shéma
schemaPassword
.is().min(8)                                    // longeur minimale 8
.is().max(100)                                  // longeur maximale 100
.has().uppercase()                              // Doit contenir des lettres majuscules
.has().lowercase()                              //Doit contenir des lettres minuscules
.has().digits(2)                                // Doit avoir au moins 2 chiffre
.has().not().spaces()                           // ne pas avoir d'espaces
.is().not().oneOf(['Passw0rd', 'Password123']); // mettre ces valeurs sur liste noire

//signup pour enregistre de nouveaux utilisateur
exports.signup = (req, res, next) => {
  if(!schemaPassword.validate(req.body.password)){
    return res.status(400).json({ message: "mot de passe invalide" });  
  }
    bcrypt
    .hash(req.body.password, 10) //fonction pour cripte un mot de passe. le chiffre 10 est pour faire le tour de l'algorithme
    .then((hash) => { //crée un nou velle utilisateur avec le mot de passe crypté est l'adresse mail
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user //on enregistre l'utilisarteur dans la base de donné
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) =>{ 
      console.log(error);
      return  res.status(500).json({ error });
    });
};

//pour connecter les utilisateurs existent
exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              message: "Paire login/mot de passe incorrecte",
            });
          }
          res.status(201).json({
            userId: user._id,
            token: jwt.sign( //on chiffre un nouveau token qui contient l'ID de l'utilisateur
              { userId: user._id },
              process.env.TOKEN,// on utilisons une chaîne secrète de développement temporaire pour crypter notre token
              {
                expiresIn: "24h",//On définissons la durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures.
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};