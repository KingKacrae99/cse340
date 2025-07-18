// import the pool functionality from the pg package
/** pool is a list of connection that allow multiple 
visitor interact with the DB at any given time **/

const { Pool } = require("pg")
/** import dotenv(.env) package **/
require("dotenv").config()
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */

// variable to store the functionality of the pool connection.
let pool
if (process.env.NODE_ENV == "development") {
  //creates a new pool instance from the imported Pool class
    pool = new Pool({
  //indicates how the pool will connect to the database
    connectionString: process.env.DATABASE_URL,
   //describes how the Secure Socket Layer (ssl) is used
    ssl: {
      rejectUnauthorized: false,
    },
})

// Added for troubleshooting queries
    // during development

/** Lines 20-31 - exports an asynchronous query function
that accepts the text of the query and any parameters**/
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  },
}
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  module.exports = pool
}