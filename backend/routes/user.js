/* Importing express and the controllers then creating the router */

const express = require('express');
const userCtrl = require('../controllers/user');
const router = express.Router();

/* Creating the 2 post routes with their corresponding controllers */

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

/* Exporting the router */

module.exports = router;