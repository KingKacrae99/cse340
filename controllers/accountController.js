const utilities = require("../utilities/")
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/*************************************************
 * Deliver login view
 ***********************************************/

async function buildLogin(req,res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  /*** Hash password berfore storing ***/
  let hashedPassword
  try {
    // regular password and cost (salt is generated automattically )
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulation, you\'re registered ${account_firstname}. Please log in`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed. ")
    req.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
*  Process Login
* *************************************** */
async function processLogin(req, res) {
  const nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const loginResult = await accountModel.getAccountByEmail(account_email)

  try {
    if (bcrypt.compare(account_password, loginResult.account_password)) {
      delete loginResult.account_password
      const accessToken = jwt.sign(loginResult, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt",accessToken,{ httpOnly: true, maxAge: 3600 * 1000})
      } else {
        res.cookie("jwt", accessToken,{httpOnly:true, secure: true, maxAge: 3600 * 1000})
      }
      return res.redirect("/account/")
    } else {
      res.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email
      })
    }
    // if (loginResult) {
    //   req.flash(
    //     "notice",
    //     `You've Logged In. Welcome ${loginResult.account_firstname}`
    //   )
    //   res.status(200).render("index", {
    //     title: "Home",
    //     nav,

    //   })
    // } else {
    //   req.flash("notice", "Sorry, no account exist with those credentials.")
    //   res.status(400).render("account/login", {
    //     title: "Login",
    //     nav,
    //     errors: null,
    //     account_email,
    //   })
    // }
  } catch (error) {
    throw new Error('Access Forbidden')
    // req.flash("notice", "Login failed due to a server error.")
    // res.status(500).render("account/login", {
    //   title: "Login",
    //   nav,
    //   account_email
    // })
  }
}

/**********************************************************************
 *  Delivers the Default Account View
 **********************************************************************/
async function defaultAccount(req, res, next) {
  try {
    const nav = await utilities.getNav()
    req.flash("confirmation", "You're logged in")
    res.status(200).render("account/account", {
      title: "User Account",
      nav,
      errors: null
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { buildLogin, buildRegister,registerAccount, processLogin, defaultAccount}