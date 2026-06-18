/** imports the database connection file
 * (named index.js)**/

const { Pool } = require("pg");
const pool = require("../database/");

/* **********************************
* Get all classification data
*************************************/

async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* **************************************************
* Get all inventoryitems and classification_name by classification_id
********************************************************************/
async function getInventoryByClassificationId(classification_name ) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            USING (classification_id)
            WHERE c.classification_name = $1`,
            [classification_name]
        )
        console.log("getInventoryByClassificationId :",data)
        return data.rows
    } catch (error) {
        console.error("getclassificationbyid error " + error)
    }
}

/*****************************************************************
 *  Get Inventory by ID
 *****************************************************************/
async function getInventoryRowById(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory
             WHERE inv_id = $1`,
             [inv_id]
        )
        return data.rows[0]
     } catch (error) {
        console.error("getInventoryRowById error " + error)
    }
}
/*******************************************************************
 *  Add Classification
 *******************************************************************/
async function addClassification(classification_name, icon_class) {
    try {
         const sql = "INSERT INTO public.classification(classification_name, icon_class) VALUES($1, $2) RETURNING *"
         return await pool.query(sql,[classification_name, icon_class])   
    } catch (error) {
        console.error("addClassification error" + error.message)
    }
}

/***********************************************************
 *  Get Classification Name
 **********************************************************/
async function getClassificationName() {
    try {
        const sql = await pool.query("SELECT * FROM public.classification")
        return sql.rows
    } catch (error) {
        console.log("getClassificationName error" + error)
    }
}
/**********************************************************
 *  Add Inventory
 **********************************************************/
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
            inv_price, inv_miles, inv_color, classification_id) {
    try {
        const sql = `INSERT INTO public.inventory(inv_make,
            inv_model,inv_year,inv_description,inv_image,inv_thumbnail,
            inv_price,inv_miles,inv_color,classification_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`
        const result= await pool.query(sql, [
            inv_make, inv_model, inv_year, inv_description, inv_image,
            inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
        ])
        return result.rows[0]
    } catch (error) {
        console.log("addInventory Error", error)
        throw error
    }
}

async function getLikedInventorybyClass() {
    try {
        const sql = `SELECT DISTINCT ON (c.classification_name) 
        i.*, c.classification_name 
        FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id
        ORDER BY c.classification_name,
        i.likes_count DESC
        LIMIT 6`
        const result = await pool.query(sql)
        return result.rows
        console.log("getLikedInventorybyClass result", result.rows)
    } catch(error){
        console.error("getlikedInventorybyClass error" + error)
    }
}

async function getBrandNames() {
    try {
        const sql = `
            SELECT DISTINCT ON (inv.inv_make) 
                inv.inv_make,
                c.classification_name 
            FROM public.inventory AS inv
            JOIN public.classification AS c
              ON inv.classification_id = c.classification_id
            ORDER BY inv.inv_make ASC, c.classification_name ASC
        `;
        
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        console.error("getBrandNames database function error: " + error);
        throw error;
    }
}
// Get all inventory items filtered by vehicle manufacturer/brand
async function getVehiclesByBrand(inv_make) {
    try {
        const sql = `
            SELECT * FROM public.inventory AS inv
            WHERE LOWER(inv.inv_make) = LOWER($1)
        `;
        
        const result = await pool.query(sql, [inv_make]);
        console.log("getVehiclesByBrand result", result.rows);
        return result.rows;
    } catch (err) {
        console.error("getVehiclesByBrand model database error: ", err);
        throw err;
    }
}
async function getCarsByLikes(){
    try{

        const sql = `SELECT * FROM inventory
                     ORDER BY likes_count 
                     LIMIT 10`;

        const result = await pool.query(sql);

        if (result.rows.length === 0) {
            throw new Error("No data found!",404);
        }

        return result.rows;
    }catch(error){
        console.log("getCarsByLikes error :", error)
    }
}

async function searchInventory(filters = {}) {

    let sql = `
        SELECT *
        FROM inventory
        WHERE 1=1
    `;

    const values = [];
    let count = 1;

    const allowedFields = {
        invMake: 'inv_make',
        invModel: 'inv_model',
        invYear: 'inv_year',
        invColor: 'inv_color'
    };

    Object.entries(filters).forEach(([key, value]) => {

        if (!value || !allowedFields[key]) return;

        sql += ` AND ${allowedFields[key]} ILIKE $${count}`;

        values.push(`%${value}%`);

        count++;
    });

    const result = await pool.query(sql, values);

    return result.rows;
}
/* ***************************
 * Get All Inventory Items (Luxury Catalog)
 * ************************** */
async function getAllInventory() {
    try {
        const sql = `
            SELECT 
                inv.inv_id,
                inv.inv_make,
                inv.inv_model,
                inv.inv_year,
                inv.inv_description,
                inv.inv_image,
                inv.inv_thumbnail,
                inv.inv_price,
                inv.inv_miles,
                inv.inv_color,
                inv.likes_count,
                c.classification_name
            FROM public.inventory AS inv
            JOIN public.classification AS c
              ON inv.classification_id = c.classification_id
            ORDER BY inv.inv_make ASC, inv.inv_model ASC
        `;
        
        const result = await pool.query(sql);
        console.log("getAllInventory total records fetched:", result.rowCount);
        return result.rows;
    } catch (err) {
        console.error("Database Error inside inventoryModel.getAllInventory:", err);
        throw err;
    }
};

/* ***************************
 * Get Filtered Inventory (Dynamic Parameters Deck)
 * ************************** */
async function getFilteredInventory(filters) {
    try {
        let sql = `
            SELECT inv.*, c.classification_name
            FROM public.inventory AS inv
            JOIN public.classification AS c ON inv.classification_id = c.classification_id
            WHERE 1=1`;
        
        const queryParams = [];
        let paramIndex = 1;

        if (filters.make) {
            sql += ` AND LOWER(inv.inv_make) = LOWER($${paramIndex})`;
            queryParams.push(filters.make);
            paramIndex++;
        }

        if (filters.bodyStyle) {
            sql += ` AND LOWER(c.classification_name) = LOWER($${paramIndex})`;
            queryParams.push(filters.bodyStyle);
            paramIndex++;
        }

        sql += ` ORDER BY inv.inv_make ASC`;
        
        const result = await pool.query(sql, queryParams);
        return result.rows;
    } catch (err) {
        console.error("Error executing dynamic getFilteredInventory matching query:", err);
        throw err;
    }
};
/**
 * *******************************************************************
 * Insert a newly consigned luxury vehicle configuration into inventory
 * *******************************************************************
 */
async function insertConsignedVehicle(vehicle) {
    try {
        const sql = `
            INSERT INTO public.inventory (
                inv_make, inv_model, inv_year, inv_description, 
                inv_image, inv_thumbnail, inv_price, inv_miles, 
                inv_color, classification_id, account_id, inv_approved
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, FALSE) 
            RETURNING *;
        `;
        
        const data = await pool.query(sql, [
            vehicle.inv_make,
            vehicle.inv_model,
            vehicle.inv_year,
            vehicle.inv_description,
            vehicle.inv_image,
            vehicle.inv_thumbnail,
            vehicle.inv_price,
            vehicle.inv_miles,
            vehicle.inv_color,
            vehicle.classification_id,
            vehicle.account_id // Bound safely to parameter marker $11
        ]);
        
        return data.rows[0]; 
    } catch (error) {
        console.error("insertConsignedVehicle DB Error Details:", error);
        return null;
    }
}

module.exports = {
    getClassifications, getInventoryByClassificationId,
    getInventoryRowById, addClassification,
    getClassificationName, addInventory,
    getLikedInventorybyClass, getBrandNames,
     getVehiclesByBrand, getCarsByLikes, 
     searchInventory, getAllInventory,getFilteredInventory,
     insertConsignedVehicle
}