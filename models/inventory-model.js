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
async function getInventoryByClassificationId(classification_id ) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
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

module.exports = {
    getClassifications, getInventoryByClassificationId,
    getInventoryRowById, addClassification,
    getClassificationName, addInventory,
    getLikedInventorybyClass
}