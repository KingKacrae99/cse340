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

async function getAccountByEmail(account_email) {
    try {
      const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1"
      const data = await pool.query(sql, [account_email])
      return data.rows[0]
    } catch (error) {
      return new Error("No matching email found!")
    }
}
async function getAccountById(account_id) {
    try {
      const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1"
      const data = await pool.query(sql, [account_id])
      return data.rows[0]
    } catch (error) {
      return new Error("No account found!")
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
async function checkUpdateEmail(account_id, account_email){
  try {
    const sql = "SELECT * FROM public.account WHERE account_id != $1 AND account_email = $2"
    const email = await pool.query(sql, [account_id,account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

async function updateAccount(account_id,account_firstname,account_lastname,account_email) {
  try {
    const sql = "UPDATE public.account SET account_firstname = $2, account_lastname = $3, account_email = $4 WHERE account_id = $1 RETURNING *"
    const data = await pool.query(sql, [account_id, account_firstname, account_lastname, account_email])
    return data.rows[0];
  } catch (error) {
    new Error("Account Update Error: "+ error.message)
  }
}

async function updatePassword(account_id,account_password) {
  try {
    const sql = "UPDATE public.account SET account_password = $2 WHERE account_id = $1"
    const result = await pool.query(sql, [account_id, account_password])
    return result.rowCount > 0
  } catch (error) {
    throw new Error("Change Password Error: " + error.message)
  }
}

/******************************************************
 *   Retrieve first 5 Recent Login from the Login Table
 ******************************************************/
async function getRecentLogins(account_id) {
  const sql = "SELECT login_time, ip_address FROM public.login_history WHERE account_id = $1 ORDER BY login_time DESC LIMIT 5";
  const result = await pool.query(sql, [account_id]);
  return result.rows;
}

/******************************************************
 *  Add Login to Login History Table
 *****************************************************/
async function addLoginHistory(account_id, ip_address) {
  const sql = `
    INSERT INTO login_history (account_id, ip_address)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await pool.query(sql, [account_id, ip_address]);
  return result.rows[0];
}


module.exports = {
  registerAccount, checkExistingEmail,
  getAccountByEmail, getAccountById,
  checkUpdateEmail, updateAccount,
  updatePassword, getRecentLogins,
  addLoginHistory
}