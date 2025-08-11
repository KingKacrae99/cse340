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
        const data = await invModel.getClassificationName()
        const select = await utilities.buildDropdown(data)
        res.render("inventory/management", {
            title: "Vehicle Management",
            nav,
            select
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryRowById(inv_id)
  const data = await invModel.getClassificationName()
  const classificationSelect = await utilities.buildUpdateDropdown(data,itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("confirmation", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/mgt")
  } else {
    const data = await invModel.getClassificationName()
    const classificationSelect = await utilities.buildUpdateDropdown(data,classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })
  }
}

/*********************************************************
 *  DELETE Inventory Confirmation VIEW
 *********************************************************/
invCont.confirmDeleteInventoryView  = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryRowById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "You are about to delete this item " + '"'+ itemName +'"',
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* *****************************************
 *   Delete Inventory Data
 * ****************************************/
invCont.deleteInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
  } = req.body
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    const itemName = inv_make + " " + inv_model
    req.flash("confirmation", `The ${itemName} was deleted successfully.`)
    res.redirect("/inv/mgt")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry,the delete process failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "You are about to delete this item " + '"'+ itemName +'"',
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}


module.exports = invCont