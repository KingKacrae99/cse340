// import the database connection
const pool = require("../database/");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        //The "RETURNING *" clause indicates to the PostgrSQL server to return values based on the record that was inserted. It is a way to confirm that the insertion worked.
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql,[account_firstname,account_lastname,account_email, account_password])
    } catch (error) {
        return error.message
    }
}

async function loginAccount(account_email, account_password) {
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1 AND account_password = $2"
      const data = await pool.query(sql, [account_email, account_password])
      return data.rows[0]
    } catch (error) {
      return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = {registerAccount, checkExistingEmail, loginAccount}