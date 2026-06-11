// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const baseController = require("../controllers/baseController");
const utilities = require("../utilities/index");
const invValidate = require("../utilities/inventory-validation");
const sellValidate = require("../utilities/sell-validation");
const upload = require("../utilities/route-mapper");
const imgProcessor = require('../utilities/image-processor');

//Route to build inventory by classification view
router.get("", utilities.handlerErrors(invController.buildFullShowroom));
router.get("/sell", utilities.handlerErrors(invController.buildSellVehiclePage));
router.get("/details/:invId", utilities.handlerErrors(invController.buildByInventId));
router.get("/filter", utilities.handlerErrors(invController.filterShowroomData));
router.get("/mgt", invController.buildMgt);
router.get("/create-classification", utilities.handlerErrors(invController.buildAddClassification));
router.get("/create-inv", utilities.handlerErrors(invController.buildAddInventory));
router.get("/:invMake", utilities.handlerErrors(invController.getCarsByBrand));


router.post("/add-classification", invController.processAddClassification)
router.post("/add-inventory",invValidate.addInventoryRules(), utilities.handlerErrors(invController.processAddInventory));
router.post("/search", utilities.handlerErrors(invController.searchInv));
// Route Listener mapping post events
router.post("/sell",upload.single('inv_image'),imgProcessor.processVehicleImagery, 
            sellValidate.consignmentRules(), sellValidate.checkConsignmentData, 
            utilities.handlerErrors(invController.handleVehicleConsignmentPost)
        );

module.exports = router;