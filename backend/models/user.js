const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const validator = require("email-validator");
validator.validate("test@email.com"); 

const passwordValidator = require('password-validator');
// crée un schéma
const schema = new passwordValidator();
// ajouté des propriétés au shéma
schema
.is().min(8)                                    // longeur minimale 8
.is().max(100)                                  // longeur maximale 100
.has().uppercase()                              // Doit contenir des lettres majuscules
.has().lowercase()                              //Doit contenir des lettres minuscules
.has().digits(2)                                // Doit avoir au moins 2 chiffre
.has().not().spaces()                           // ne pas avoir d'espaces
.is().not().oneOf(['Passw0rd', 'Password123']); // mettre ces valeurs sur liste noire

// Valider par rapport à une chaîne de mot de passe
console.log(schema.validate('validPASS123'));
// => vraie
console.log(schema.validate('invalidPASS'));
// => faux

// Récupère une liste complète des règles qui ont échoué 
console.log(schema.validate('joke', { list: true }));
// => [ 'min', 'majuscule', 'chiffres' ]
const userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required"
  },
  password: {
    type: String
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);