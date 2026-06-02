const express = require('express');
const router = express.Router();
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

router.get("/:classificationName/:classificationId", utilities.handlerErrors(invController.buildByClassificationId));

module.exports = router;