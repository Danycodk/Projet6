const express = require('express');
const router = express.Router();
//const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

const saucesCtrl = require('../controllers/saucesLogic');
//On separe leslogiques pour facilite la compréhension de notre fichier de routeur
//Retrouver les logiques de chaque routes dans CONTROLLERS/STUFF.JS

router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauces);
router.post('/', auth, multer, saucesCtrl.createSauces);
router.put('/:id', auth, multer, saucesCtrl.modifySauces);
router.delete('/:id', auth, saucesCtrl.deleteSauces);
router.post('/:id/like', auth, saucesCtrl.gotLike);

module.exports = router;