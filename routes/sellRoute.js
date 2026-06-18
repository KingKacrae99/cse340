const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController") // Or your dedicated sell/consignment controller
const utilities = require("../utilities")
const sellValidate = require("../utilities/sell-validation");
const upload = require("../utilities/route-mapper");
const imgProcessor = require('../utilities/image-processor');


// 1. PUBLIC ROUTE: The Informational Landing Page (No checkLogin middleware)
router.get("/", utilities.handlerErrors(invController.buildSellLandingPage));

// 2. PROTECTED ROUTE: The Actual Form Page (Requires checkLogin middleware)
router.get("/form", utilities.checkLogin, utilities.handlerErrors(invController.buildSellVehiclePage));

// 3. PROTECTED ROUTE: Form Submission Processing Action
// (Ensure your form action attribute in the view points to "/sell" to match this)
router.post("/", 
    utilities.checkLogin, 
    upload.single('inv_image'),
    imgProcessor.processVehicleImagery, 
    sellValidate.consignmentRules(), 
    sellValidate.checkConsignmentData, 
    utilities.handlerErrors(invController.handleVehicleConsignmentPost)
);

module.exports = router;