/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const classificationRoute = require("./routes/classificationRoute");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require('./routes/accountRoute');
const favoriteRoute = require('./routes/favoriteRoute');
const sellRoute = require('./routes/sellRoute');
const financeRoute = require('./routes/financeRoute');
const utilities = require("./utilities/");
const session = require("express-session");
const pool = require('./database/');
const bodyParser = require("body-parser");
const invModel = require("./models/inventory-model");

/* ***********************
 * Middleware
 *************************/
app.use(async (req, res, next) => {
  try {
    res.locals.currentPath = req.originalUrl;
    res.locals.footerClassLinks = await invModel.getClassifications();
    res.locals.brandNames = await invModel.getBrandNames();
    res.locals.featuredCars = await invModel.getLikedInventorybyClass();
    res.locals.topCars = await invModel.getCarsByLikes();
    next();
  } catch (error) {
    next(error);
  }
});

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

app.use(utilities.checkLoginStatus);
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
app.use(static);
app.use("/inv", inventoryRoute);
app.use("/category", classificationRoute);
app.use("/account", accountRoute);
app.use("/favorites", favoriteRoute);
app.use("/sell", sellRoute);
app.use("/finance", financeRoute);

app.get("/", utilities.handlerErrors(baseController.buildHome));
app.get("/api/weather", utilities.handlerErrors(baseController.currentWeather));
app.get("/error/err/test", utilities.handlerErrors(baseController.quick));

app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry we appear to have lost the page!' });
});

/* ***********************
* Express Error Handler
*************************/
app.use(async (err, req, res, next) => {
  const message = err.status == 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
  console.log("error message:",err)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: message,
  });
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`Server running at ${host}:${port}`);
});
