const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//signup pour enregistre de nouveaux utilisateur
exports.signup = (req, res, next) => {
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
              'RANDOM_TOKEN_SECRET',// on utilisons une chaîne secrète de développement temporaire pour crypter notre token
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