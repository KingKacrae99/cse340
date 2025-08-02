/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require('./routes/accountRoute')
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
// bodyParser make the application aware of that functionality
// In order to colloect the values from the incoming
const bodyParser = require("body-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
   // refering to where the session data will be stored
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  // the secret name-value pair that will be used to protect the session.
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  // name assigned to each Id when ceated
  name: 'sessionId',
}))

// Express Messages Middleware
/* Import the connect-flash package */
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  // to assign the response object, using the "locals" option and a name of "messages"
  res.locals.messages = require('express-messages')(req, res)
  next()
})
//  tells the express application to use the body parser to work with JSON data
app.use(bodyParser.json())
/*
*tells the express application to read and work with data sent via a URL as well as from a form, 
stored in the request object's body. The "extended: true" object is a configuration that allows rich
 objects and arrays to be parsed. The final part is an inline comment pertaining to the entire line.
*/
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not as view root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Inventory routes
app.use("/inv", inventoryRoute)

// account login route
app.use("/account", accountRoute)

//Index route
app.get("/", utilities.handlerErrors(baseController.buildHome))
app.get("/error/err/test", utilities.handlerErrors(baseController.quick))
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status:404, message:'Sorry we appear to have lost the page!'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  //let message
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if (err.status == 404){message = err.message} else{message='Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
