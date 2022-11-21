const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multher-config');

const sauceController = require('../controllers/sauces');
const likeController = require('../controllers/like')

router.post('/', auth, multer, sauceController.createSauce);
router.put('/:id', auth, multer, sauceController.modifySauce);
router.delete('/:id', auth, sauceController.deleteSauce);
// on réagir uniquement aux requêtes de type GET
router.get('/:id', auth, sauceController.getOneSauce);
router.get('/', auth, sauceController.getAllSauce);
router.post("/:id/like", auth, likeController.likeSauce);


module.exports = router;