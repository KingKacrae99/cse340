const utilities = require(".")
// use to access data and retrieve data
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const invValidate = {}

invValidate.addInventoryRules = () => {
    return [
        body("classification_id")
            .notEmpty()
            .withMessage("Please select a classification."),
        
        body("inv_make")
            .trim()
            .escape()
            .isLength({ min: 3 }).withMessage("Make must be at least three character long")
            .notEmpty().withMessage("Please provide the vehicle make"),
        
        body("inv_model")
            .trim()
            .escape()
            .isLength({ min: 3 }).withMessage("Model must be at least three character long")
            .notEmpty().withMessage("Please provide the vehicle model"),
        
        body("inv_year")
            .trim()
            .isLength({ max: 4, min: 4 })
            .isInt({ min: 1900, max: new Date().getFullYear() })
            .withMessage(`Year must be between 1900 and ${new Date().getFullYear()}`)
            .notEmpty()
            .withMessage("Please enter valid year")
            .toInt(),
        
        body("inv_description")
            .notEmpty()
            .withMessage("You have not enter the description"),
        
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Please Provide an image path"),
        
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Please Provide an Thumbnail path"),
        
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please enter a valid value"),
        
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()        
            .withMessage("Please provide a valid value"),
        
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Provide the vehicle's color.")
    ]
}
invValidate.updateInventoryRules = () => {
    return [
        body("classification_id")
            .notEmpty()
            .withMessage("Please select a classification."),
        
        body("inv_make")
            .trim()
            .escape()
            .isLength({ min: 3 }).withMessage("Make must be at least three character long")
            .notEmpty().withMessage("Please provide the vehicle make"),
        
        body("inv_model")
            .trim()
            .escape()
            .isLength({ min: 3 }).withMessage("Model must be at least three character long")
            .notEmpty().withMessage("Please provide the vehicle model"),
        
        body("inv_year")
            .trim()
            .isLength({ max: 4, min: 4 })
            .isInt({ min: 1900, max: new Date().getFullYear() })
            .withMessage(`Year must be between 1900 and ${new Date().getFullYear()}`)
            .notEmpty()
            .withMessage("Please enter valid year")
            .toInt(),
        
        body("inv_description")
            .notEmpty()
            .withMessage("You have not enter the description"),
        
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Please Provide an image path"),
        
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Please Provide an Thumbnail path"),
        
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please enter a valid value"),
        
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()        
            .withMessage("Please provide a valid value"),
        
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Provide the vehicle's color.")
    ]
}
module.exports = invValidate