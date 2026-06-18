const express = require("express")
const router = new express.Router()
const financeController = require("../controllers/financeController")
const utilities = require("../utilities")


router.get("/", utilities.handlerErrors(financeController.buildFinanceLandingPage));

// PROTECTED ROUTE: The Actual Application Form (Triggered by the Smart qualification card CTA)
router.get("/apply", utilities.checkLogin, utilities.handlerErrors(financeController.buildFinanceApplicationPage));

//PROTECTED ROUTE: Handle Application Data Processing Pipeline
router.post("/apply", utilities.checkLogin, utilities.handlerErrors(financeController.handleFinanceApplicationPost));

module.exports = router;