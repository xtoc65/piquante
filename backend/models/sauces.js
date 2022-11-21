//on importe mongoose
const mongoose = require("mongoose");

//on crée un shéma de donner avec toute les informations dont nos objet auront besoin
const sauceSchema = mongoose.Schema({ //la methode shema de Mongoose vous permet de créer un schéma de données pour votre base de données MongoDB.
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
});

//on a exporté le model
//La méthode model transforme ce modèle en un modèle utilisable.
module.exports = mongoose.model("Sauce", sauceSchema);