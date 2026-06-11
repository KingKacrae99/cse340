const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model"); // Adjust to your exact model path
const utilities = require("./index"); // Adjust to your utilities index path

const sellValidate = {};

/**
 * LUXURY CONSIGNMENT DATA ENTRY CORRECTION MATRIX
 * Checks incoming body items parsed by Multer
 */
sellValidate.consignmentRules = () => {
    return [
        // Manufacturer Name (inv_make)
        body("inv_make")
            .trim()
            .escape()
            .notEmpty().withMessage("Manufacturer (Make) metric cannot be submitted blank.")
            .isLength({ min: 2 }).withMessage("Manufacturer requires a minimum of 2 characters."),

        // Vehicle Model Name (inv_model)
        body("inv_model")
            .trim()
            .escape()
            .notEmpty().withMessage("Vehicle Model name field cannot be submitted blank."),

        // Production Year (inv_year)
        body("inv_year")
            .trim()
            .isInt({ min: 1900, max: new Date().getFullYear() + 2 })
            .withMessage(`Model Year must be a valid integer between 1900 and ${new Date().getFullYear() + 2}.`),

        // Mileage Count (inv_miles)
        body("inv_miles")
            .trim()
            .isInt({ min: 0 })
            .withMessage("Odometer tracking state must register as a valid positive integer value."),

        // Exterior Finish Color (inv_color)
        body("inv_color")
            .trim()
            .escape()
            .notEmpty().withMessage("Exterior color finish specification is required."),

        // Expected Value / MSRP Price (inv_price)
        body("inv_price")
            .trim()
            .isInt({ min: 1 })
            .withMessage("Expected showroom valuation must be a positive number greater than zero."),

        // Vault Classification Structural Dropdown Group (classification_id)
        body("classification_id")
            .trim()
            .isInt({ min: 1 })
            .withMessage("Please assign a valid structural category classification from the menu matrix."),

        // Detailed Background Narrative (inv_description)
        body("inv_description")
            .trim()
            .escape()
            .notEmpty().withMessage("Please supply a historical narrative profile for asset evaluation validation.")
    ];
};

/**
 * INTERCEPT CHOKEPOINT: Check errors and stop processing if rules fail
 */
sellValidate.checkConsignmentData = async (req, res, next) => {
    let errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // Fetch UI scaffolding layouts to reconstruct structural integrity safely
        let nav = await utilities.getNav();
        const classifications = await invModel.getClassifications();
        
        // Expose structured array list straight to your template loop blocks
        res.render("inventory/sell-vehicle", {
            title: "Asset Consignment Registry",
            nav,
            classifications: classifications.rows || classifications,
            errors: errors.array(), // Pass array of error metrics down to view alerts
            // Repopulate user input so they don't have to retype everything!
            inv_make: req.body.inv_make,
            inv_model: req.body.inv_model,
            inv_year: req.body.inv_year,
            inv_miles: req.body.inv_miles,
            inv_color: req.body.inv_color,
            inv_price: req.body.inv_price,
            classification_id: req.body.classification_id,
            inv_description: req.body.inv_description
        });
        return;
    }
    next();
};

module.exports = sellValidate;