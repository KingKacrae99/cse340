const express = require('express');
const router = express.Router()
const favoriteController = require("../controllers/favoriteController")
const utilities = require("../utilities/index")






router.post('/toggle', utilities.handlerErrors(favoriteController.toggleFavorite));

module.exports = router;