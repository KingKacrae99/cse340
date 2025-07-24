const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ********************************************
 * build inventory by classification view
 **********************************************/
invCont.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_id = req.params.classificationId
        const data = await invModel.getInventoryByClassificationId(classification_id)
        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        if (data.lengthh < 1) {
            const error = new Error("No vehicles for found this category.")
            error.status = 404;
            throw error
        }
        const className = data[0].classification_name
        res.render("inventory/classification", {
            title: className +" "+ "Vehicles",
            nav,
            grid,
        })
    } catch(err) {
        next(err)
    }
}

invCont.buildByInventId = async function (req, res, next) {
    try {
        const inv_id = req.params.invId
        const data = await invModel.getInventoryRowById(inv_id)
        const dataDetails = await utilities.buildInventDetails(data)
        let nav = await utilities.getNav()
        if (!data) {
            const error = new Error("Inventory item not found!")
            error.status = 404;
            throw error
        }
        res.render("inventory/details", {
            title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
            nav,
            dataDetails,
        })

    } catch (err) {
        next(err)
    }
}

module.exports = invCont