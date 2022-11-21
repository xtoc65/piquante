const Sauce = require("../models/sauces");

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })//findOne permet de trouvé un seul sauce
    .then((sauce) => {
      if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
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

      if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "La sauce a été aimer" }))
          .catch((error) => res.status(404).json({ error }));
      }

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
            res.status(201).json({ message: "la sauce n'est pas aimer" })
          )
          .catch((error) => res.status(404).json({ error }));
      }

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
            res.status(201).json({ message: "la sauce n'est pas aimer" })
          )
          .catch((error) => res.status(404).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};