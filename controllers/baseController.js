const utilities = require("../utilities/")
const baseController = {}
const invmodel = require("../models/inventory-model")

baseController.buildHome = async function (req, res) {
    const classification = await invmodel.getClassifications();
    const featuredCars = await invmodel.getLikedInventorybyClass();
    //req.flash("notice", "This is a flash message.")
   res.render("index", {title: "Home", classification, featuredCars, currentPath: req.originalUrl}) 
}
baseController.quick = async (req, res, next) => {
    try {
        const nav = utilities.getquick()
        if (!nav) {
            const err = new Error("Oops! no quick link")
            err.status = 500
            next(err)
        } else {
            res.render("errors/error", { title: "Home", nav }) 
        }   
    } catch (err) {
        err.message = "Oops! something went wrong"
        next(err)
    }

}
module.exports = baseController
