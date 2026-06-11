const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ********************************************
 * build inventory by classification view
 **********************************************/
invCont.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_name = req.params.classificationName
        const data = await invModel.getInventoryByClassificationId(classification_name)
        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        if (data.length < 1) {
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
        //const nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            title: "Add Classification"
            //nav
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
    const { classification_name, icon_class } = req.body
    
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
        const result = await invModel.addClassification(classification_name, icon_class)
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

invCont.searchInv =async (req, res, next) => {
    try {
        const data = await invModel.searchInventory(req.body);

        if (data.length < 0) {
            return res.status(401).json({
                success: false,
                message:"No Car was found with the information provided",
            });
        }

        return res.status(200).json({
            success:true,
            message:"Data found!",
            result: data
        });

    } catch (error) {
        next(error)
    }
}

invCont.getCarsByBrand = async (req, res, next) =>{
    try{
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
    }catch (err){
        next(err)
    }
}

invCont.buildFullShowroom = async function (req, res, next) {
    try {

        const data = await invModel.getAllInventory();
        const brandNames = await invModel.getBrandNames();
        const classNames = await invModel.getClassificationName();
        
        // Render the main collection template block
        res.render("inventory/index", {
            title: "The Elite Fleet Showroom",
            cars: data || [],
            brandNames: brandNames || [],
            classNames: classNames || []
        });
        
    } catch (err) {
        console.error("Critical failure tracking inside invCont.buildFullShowroom execution block:", err);
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
        
        // Return structured, clean data array directly back to the client context track
        return res.json(filteredCars);
    } catch (err) {
        console.error("Error formatting filtered response delivery inside controller:", err);
        res.status(500).json({ error: "Showroom sorting matrix collapsed." });
    }
};

invCont.buildSellVehiclePage = async function (req, res, next) {
    try {
        // Fetch classification array to populate the drop-down (e.g., id and name)
        // Adjust this model call to match your exact helper name (e.g., getClassifications())
        const classifications = await invModel.getClassifications();

        res.render("inventory/sell-vehicle", {
            title: "Asset Consignment Registry",
            classifications: classifications.rows || classifications // Handle array formatting safety
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
        // 1. Check if Multer successfully processed and caught the uploaded file asset
        if (!req.file) {
            // Re-render page with a warning notification if no image was supplied
            let nav = await utilities.getNav();
            const classifications = await invModel.getClassifications();
            
            req.flash("notice", "Meticulous vehicle presentation requires an asset image. Please re-upload.");
            return res.status(400).render("inventory/sell-vehicle", {
                title: "Asset Consignment Registry",
                nav,
                classifications: classifications.rows || classifications
            });
        }

        // 2. Extract and sanitize incoming form payloads from req.body
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

        // 3. Extract final asset string locations calculated cleanly by the image processor middleware
        const inv_image = req.body.inv_image;
        const inv_thumbnail = req.body.inv_thumbnail;

        // 4. Pass sanitized parameters to your model's database insert sequence
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
            classification_id: parseInt(classification_id, 10)
        });

        // 5. Direct the client upon success or failure states
        if (insertResult) {
            req.flash("notice", `Success: Your ${inv_year} ${inv_make} has been recorded into the vetting vault matrix.`);
            res.redirect("/inv"); // Redirect straight to main inventory view catalog index
        } else {
            req.flash("notice", "Database configuration failed to register your vehicle profile. Please try again.");
            
            // Reload page states dynamically if query fails
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


module.exports = invCont