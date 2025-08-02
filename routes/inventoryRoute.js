// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const baseController = require("../controllers/baseController");
const utilities = require("../utilities/index");
const invValidate = require("../utilities/inventory-validation");

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handlerErrors(invController.buildByClassificationId));
router.get("/inv/inv/detail/:invId", utilities.handlerErrors(invController.buildByInventId));
router.get("/mgt", invController.buildMgt);
router.get("/create-classification", utilities.handlerErrors(invController.buildAddClassification));
router.get("/create-inv", utilities.handlerErrors(invController.buildAddInventory));

router.post("/add-classification", invController.processAddClassification)
router.post("/add-inventory",invValidate.addInventoryRules, utilities.handlerErrors(invController.processAddInventory))

module.exports = router;