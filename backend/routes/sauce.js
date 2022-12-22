/* Importing express and creating the router */

const express = require('express');
const router = express.Router();

/*Importing the authentification middle and the multer config for handling images */

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/* Importing all the controllers for the sauce routes */

const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

/* Exporting the router */

module.exports = router;