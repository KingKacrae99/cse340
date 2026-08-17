const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const favModel = require("../models/favoriteModel")

const invCont = {};

/* ********************************************
 * build inventory by classification view
 **********************************************/
invCont.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_name = req.params.classificationName;
        const data = await invModel.getInventoryByClassificationId(classification_name);
        let grid ="";
        if (res.locals.loggedin){
            const account_id = res.locals.user.account_id;
            const likedCars = await favModel.likedCars(account_id);
            grid = await utilities.buildClassificationGrid(data,likedCars);
        }else{
            grid = await utilities.buildClassificationGrid(data,[])
        }

        let nav = await utilities.getNav();
        let className = data.length < 1 ? "No Cars Found" : data[0].classification_name;



        res.render("inventory/classification", {
            title: className,
            grid,
        });
    } catch (err) {
        next(err);
    }
};

invCont.buildByInventId = async function (req, res, next) {
    try {
        const inv_id = req.params.invId;
        const data = await invModel.getInventoryRowById(inv_id);
        if (!data) {
            const error = new Error("Inventory item not found!");
            error.status = 404;
            throw error;
        }
        const dataDetails = await utilities.buildInventDetails(data);
        let nav = await utilities.getNav();

        res.render("inventory/details", {
            title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
            nav,
            dataDetails,
        });
    } catch (err) {
        next(err);
    }
};

/****************************************************
 *  Build management view
 ****************************************************/
invCont.buildMgt = async function (req, res, next) {
    try {
        const nav = await utilities.getNav();
        res.render("inventory/management", {
            title: "Vehicle Management",
            nav
        });
    } catch (err) {
        next(err);
    }
};

invCont.buildAddClassification = async function (req, res, next) {
    try {
        res.render("inventory/add-classification", {
            title: "Add Classification"
        });
    } catch (err) {
        next(err);
    }
};

invCont.buildAddInventory = async function (req, res, next) {
    try {
        const nav = await utilities.getNav();
        const data = await invModel.getClassificationName();
        const select = await utilities.buildDropdown(data);
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            select 
        });
    } catch (error) {
        next(error);
    }
};

invCont.processAddClassification = async function (req, res, next) {
    const nav = await utilities.getNav();
    const { classification_name, icon_class } = req.body;
    
    const isValid = /^[A-Za-z0-9]+$/.test(classification_name);
    if (!isValid) {
        req.flash("notice", "Classification name must contain only letters and numbers. No spaces or special characters.");
        return res.status(400).render("inventory/add-classification", {
            title: "Add Classification",
            nav
        });
    }
    try {
        const result = await invModel.addClassification(classification_name, icon_class);
        if (result) {
            req.flash("confirmation", "Classification added successfully ✅.");
            res.redirect("/inv/mgt");
        } else {
            req.flash("notice", "Failed to add classification");
            res.status(401).render("inventory/add-classification", {
                title: "Add Classification",
                nav,
            });
        }
    } catch (error) {
        next(error);
    }
};

invCont.processAddInventory = async function (req, res, next) {
    const nav = await utilities.getNav();
    const data = await invModel.getClassificationName();
    const select = await utilities.buildDropdown(data);
    const { classification_id, inv_make, inv_model, inv_year,
        inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;
    
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
        );

        if (invResult) {
            req.flash("confirmation", "Inventory has been added successfully ✅");
            res.redirect("/inv/mgt");
        } else {
            req.flash("notice", "Failed to add inventory");
            res.status(400).render("inventory/add-inventory", {
                title: "Add Inventory",
                nav,
                select
            });
        }
    } catch (err) {
        next(err);
    }
};

invCont.searchInv = async (req, res, next) => {
    try {
        const data = await invModel.searchInventory(req.body);

        if (data.length < 1) {
            return res.status(401).json({
                success: false,
                message: "No Car was found with the information provided",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Data found!",
            result: data
        });
    } catch (error) {
        next(error);
    }
};

invCont.getCarsByBrand = async (req, res, next) => {
    try {
        const brandName = req.params.invMake;
        const data = await invModel.getVehiclesByBrand(brandName);
        if (!data || data.length < 1) {
            return res.render("inventory/brand", {
                title: "No Cars Found",
                brandName,
                cars: []
            });
        }
        res.render("inventory/brand", {
            title: `${brandName} Cars | Premium Showroom`,
            brandName,
            cars: data
        });
    } catch (err) {
        next(err);
    }
};

invCont.buildFullShowroom = async function (req, res, next) {
    try {
        const data = await invModel.getAllInventory();
        const brandNames = await invModel.getBrandNames();
        const classNames = await invModel.getClassificationName();
        if(res.locals.loggedin){
            const accountId = res.locals.user.account_id;
            const likedCars = await favModel.likedCars(accountId);

            return res.render("inventory/index",{
                title:"The Elite Fleet Showroom",
                cars: data || [],
                brandNames: brandNames || [],
                classNames: classNames || [],
                likedCars: likedCars
            })
        }
        
        res.render("inventory/index", {
            title: "The Elite Fleet Showroom",
            cars: data || [],
            brandNames: brandNames || [],
            classNames: classNames || []
        });
    } catch (err) {
        next(err);
    }
};

/* ***************************
 * Process Showroom Filters (AJAX Handler Response)
 * ************************** */
invCont.filterShowroomData = async function (req, res, next) {
    try {
        const filters = {
            make: req.query.make || null,
            bodyStyle: req.query.bodyStyle || null
        };

        const filteredCars = await invModel.getFilteredInventory(filters);
        return res.json(filteredCars);
    } catch (err) {
        res.status(500).json({ error: "Showroom sorting matrix collapsed." });
        next(err);
    }
};

/* ******************************************
 * Build Sell Your Car Landing Page View
 * ****************************************** */
invCont.buildSellLandingPage = async function (req, res, next) {
    res.render("inventory/sell-landing", {
        title: "Liquidate Vehicle Assets | Velocity Drives",
        user: res.locals.accountData || req.session.user || null, 
    });
};

/*****************************************************************
 * Sell Vehicle Form Page View
 ****************************************************************/
invCont.buildSellVehiclePage = async function (req, res, next) {
    try {
        const classifications = await invModel.getClassifications();
        res.render("inventory/sell-vehicle", {
            title: "Asset Consignment Registry",
            classifications: classifications.rows || classifications 
        });
    } catch (error) {
        next(error);
    }
};

/**
 * *******************************************************************
 * Process the luxury vehicle consignment form submission
 * Handle incoming multipart form data (text fields + image asset binaries)
 * *******************************************************************
 */
invCont.handleVehicleConsignmentPost = async function (req, res, next) {
    try {
        // Security Guardrail: Block unauthenticated execution requests
        if (!res.locals.loggedin || !req.session.accountData) {
            req.flash("notice", "Authentication required. Please sign in to consign vehicles to the network.");
            return res.status(401).redirect("/account/login");
        }

        // Check if Multer successfully processed and caught the uploaded file asset
        if (!req.file) {
            let nav = await utilities.getNav();
            const classifications = await invModel.getClassifications();
            
            req.flash("notice", "Meticulous vehicle presentation requires an asset image. Please re-upload.");
            return res.status(400).render("inventory/sell-vehicle", {
                title: "Asset Consignment Registry",
                nav,
                classifications: classifications.rows || classifications
            });
        }

        // Extract and sanitize incoming form payloads from req.body
        const {
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        } = req.body;

        // Extract final asset string locations calculated cleanly by the image processor middleware
        const inv_image = req.body.inv_image;
        const inv_thumbnail = req.body.inv_thumbnail;

        // Extract the validated client key directly out of session storage
        const account_id = req.session.accountData.account_id;

        // Pass sanitized parameters to your model's database insert sequence
        const insertResult = await invModel.insertConsignedVehicle({
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,       // Saved as: /images/vehicles/1718100-vehicle-name.webp
            inv_thumbnail,   // Saved as: /images/vehicles/1718100-vehicle-name-tn.webp
            inv_price: parseInt(inv_price, 10),
            inv_miles: parseInt(inv_miles, 10),
            inv_color,
            classification_id: parseInt(classification_id, 10),
            account_id: parseInt(account_id, 10) // Appending the tracking foreign key here
        });

        // Direct the client upon success or failure states
        if (insertResult) {
            req.flash("notice", `Success: Your ${inv_year} ${inv_make} has been successfully submitted to our verification team. It will appear on the showroom once approved.`);
            res.redirect("/inv"); 
        } else {
            req.flash("notice", "Database configuration failed to register your vehicle profile. Please try again.");
            
            let nav = await utilities.getNav();
            const classifications = await invModel.getClassifications();
            res.status(500).render("inventory/sell-vehicle", {
                title: "Asset Consignment Registry",
                nav,
                classifications: classifications.rows || classifications
            });
        }

    } catch (error) {
        console.error("Consignment Execution Layer Crash Logs:", error);
        next(error);
    }
};

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