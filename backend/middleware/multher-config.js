const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//multer est un package de gestion de fichier
//diskStorage() configure le chemin et le nom de fichier pour les fichiers entrants.
const storage = multer.diskStorage({
    //on indique a multer d'enregistrer les fichiers dans le dossier images
    destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //on indique à multer d'utiliser le nom d'origine de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier
  //Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée.
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//single() crée un middleware qui capture les fichiers d'un certain type et les enregistre au système de fichiers du serveur à l'aide du storage configuré.
module.exports = multer({storage: storage}).single('image');