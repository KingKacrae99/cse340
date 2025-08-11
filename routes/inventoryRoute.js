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
router.get("/mgt", utilities.checkRights, invController.buildMgt);
router.get("/create-classification", utilities.checkRights, utilities.handlerErrors(invController.buildAddClassification));
router.get("/create-inv",  utilities.checkRights, utilities.handlerErrors(invController.buildAddInventory));

router.post("/add-classification", utilities.checkRights, invController.processAddClassification)
router.post("/add-inventory", utilities.checkRights, invValidate.addInventoryRules(), utilities.handlerErrors(invController.processAddInventory))
router.get("/getInventory/:classification_id",utilities.checkLogin, utilities.handlerErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id",utilities.checkRights, utilities.checkRights, utilities.handlerErrors(invController.editInventoryView))
router.post("/update/",utilities.checkRights,invValidate.updateInventoryRules(), utilities.handlerErrors(invController.updateInventory))
router.get("/delete/:inv_id", utilities.checkRights, utilities.handlerErrors(invController.confirmDeleteInventoryView))
router.post("/confirmed/", utilities.handlerErrors(invController.deleteInventoryView))

module.exports = router;