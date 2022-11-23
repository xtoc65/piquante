const Sauce = require("../models/sauces");



exports.likeSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })//findOne permet de trouvé un seul sauce
    .then((sauce) => {
      if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) { //la personne n'a pas encore liker et il veux liker la sauce
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "la sauce a été aimer" }))
          .catch((error) => res.status(404).json({ error }));
      }

      if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) { //l'utilisateur veux annule sont like
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "La sauce a été annulè" }))
          .catch((error) => res.status(404).json({ error }));
      }
      //Qaund l'utilisateur veux disliker une sauce 
      if (
        !sauce.usersDisliked.includes(req.body.userId) && 
        req.body.like === -1
      ) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId },
          }
        )
          .then(() =>
            res.status(201).json({ message: "la sauce n'est pas aimé" })
          )
          .catch((error) => res.status(404).json({ error }));
      }
      //L'utilisateur veux enlever son dislike
      if (
        sauce.usersDisliked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
          }
        )
          .then(() =>
            res.status(201).json({ message: "Le dislike a été annulé" })
          )
          .catch((error) => res.status(404).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};