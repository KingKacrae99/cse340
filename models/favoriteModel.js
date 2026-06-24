const pg = require ("pg");
const pool = require ("../database/")

async function toggleFavorite(account_id,inv_id){

    try {
         
        // checks if the user already liked the car.
        const checksql = `SELECT * FROM favorites
                         WHERE account_id = $1
                         AND inv_id = $2`;
        
        const check = await pool.query(checksql,[account_id,inv_id]);

        //============================
        // UNLIKE
        //============================
        if(check.rows.length > 0){
            const sql = `DELETE FROM favorites
                         WHERE account_id = $1
                         AND inv_id = $2`;

            await pool.query(sql,[account_id,inv_id]);

            //Decrement the like count in inventory table
            await pool.query(`UPDATE inventory
                            SET likes_count = GREATEST(likes_count - 1, 0)
                            WHERE inv_id = $1`,[inv_id]);

            return { liked: false };
        }

        //============================
        // LIKE
        //============================
        await pool.query(`INSERT INTO favorites (account_id, inv_id)
                         VALUES ($1, $2)`, [account_id, inv_id]);

        //Increment the like count in inventory table
        await pool.query(`UPDATE inventory
                            SET likes_count = likes_count + 1
                            WHERE inv_id = $1`,[inv_id]);

        return { liked: true };
    } catch (error) {
        console.log("toggleFavorite error :", error)
    }
}

async function likedCar(params) {
    
}


module.exports = {
    toggleFavorite,
}
