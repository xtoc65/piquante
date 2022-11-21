
const Sauce = require('../models/sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Sauce enregistré !'})})
    .catch(error => { res.status(400).json( { error })})

};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})//findOne permet de trouvé un seul objet
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : "Vous n'ete pas autorisé a modifié la sauce"});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'La sauce a été modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})//findOne permet de trouvé un seul objet
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: "Vous n'ete pas autorisé a supprimé la sauce"});
            } else {
                const filename = "../images/" + sauce.imageUrl.split('/images/')[1];
                console.log(filename);
                console.log(sauce.imageUrl);
                fs.unlink(filename, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        }) 
        .catch( error => {
            res.status(500).json({ error });
        });
};


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //findOne permet de trouvé un seul objet
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find() //find permet de trouver tout les objets
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
};
