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

/****************************************************
 *  Build management view
 ****************************************************/
invCont.buildMgt = async function (req, res, next) {
    try {
       const nav = await utilities.getNav()
        res.render("inventory/management", {
            title: "Vehicle Management",
            nav
       })   
    } catch (err) {
        next(err)
    }
}
invCont.buildAddClassification = async function (req, res, next) {
    try {
        const nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            title: "Add Classification",
            nav
        })
    } catch (err) {
        next(err)
    }
}
invCont.buildAddInventory = async function (req, res, next) {
    try {
        const nav = await utilities.getNav()
        const data = await invModel.getClassificationName()
        const select = await utilities.buildDropdown(data)
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            select 
        })
    } catch (error) {
        next(error)
    }
    
}

invCont.processAddClassification = async function (req, res, next) {
    const nav = await utilities.getNav()
    const { classification_name } = req.body
    
    const isValid = /^[A-Za-z0-9]+$/.test(classification_name)
    if (!isValid) {
        req.flash(
            "notice",
            "Classification name must contain only letters and numbers. No spaces or special characters.")
        return res.status(400).render("inventory/add-classification", {
              title: "Add Classification",
              nav
            })   
    }
    try {
        const result = await invModel.addClassification(classification_name)
        if (result) {
            req.flash(
            "confirmation", "Classification added successfully ✅."
            )
            res.redirect("/inv/mgt")
        } else {
            req.flash("notice", "Failed to add classification")
            res.status(401).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            })
        }
    } catch (error) {
        next(error)
    }
}
invCont.processAddInventory = async function (req, res, next) {
    const nav = await utilities.getNav()
    const data = await invModel.getClassificationName()
    const select = await utilities.buildDropdown(data)
    const { classification_id, inv_make, inv_model, inv_year,
        inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    
    try {
        const invResult = await invModel.addInventory(
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        )

        if (invResult) {
            req.flash("confirmation", "Inventory has been added successfully ✅")
            res.redirect("/inv/mgt")
        } else {
             req.flash("notice", "Failed to add inventory")
            res.status(400).render("inventory/add-inventory", {
                title: "Add Inventory",
                nav,
                select
            })
        }
     } catch (err) {
        next(err)
    }
}

module.exports = invCont