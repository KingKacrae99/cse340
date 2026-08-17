// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const baseController = require("../controllers/baseController");
const utilities = require("../utilities/index");
const invValidate = require("../utilities/inventory-validation");

//Route to build inventory by classification view
router.get("", utilities.handlerErrors(invController.buildFullShowroom));
router.get("/details/:invId", utilities.handlerErrors(invController.buildByInventId));
router.get("/filter", utilities.handlerErrors(invController.filterShowroomData));
router.get("/mgt", invController.buildMgt);

router.get("/create-inv", utilities.handlerErrors(invController.buildAddInventory));
router.get("/:invMake", utilities.handlerErrors(invController.getCarsByBrand));


router.post("/add-classification", invController.processAddClassification)
router.post("/add-inventory",invValidate.addInventoryRules(), utilities.handlerErrors(invController.processAddInventory));
router.post("/search", utilities.handlerErrors(invController.searchInv));


module.exports = router;