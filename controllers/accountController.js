const utilities = require("../utilities/")
const accountModel = require("../models/account-model");
const invmodel = require("../models/inventory-model");
const bcrypt = require("bcryptjs")

/*************************************************
 * Deliver login view
 ***********************************************/

async function buildLogin(req,res, next) {
    res.render("account/login", {
        title: "Login"
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
  try {
    const { account_email, account_password } = req.body
    const accountData = await accountModel.loginAccount(account_email)

    if (accountData) {
      const passwordMatch = await bcrypt.compareSync(account_password, accountData.account_password)
      if (passwordMatch) {
        req.session.account = accountData
        delete accountData.account_password
        return req.session.save((err) => {
                    if (err) return next(err);
                    
                    req.flash("notice", `Welcome back, ${accountData.account_firstname}`);
                    return res.status(200).redirect("/");
        });
      } else {
        req.flash("notice", "Sorry, the password you entered is incorrect.")
        res.status(401).render("account/login", {
          title: "Login",
          account_email
        })
      }
    } else {
      req.flash("notice", "Sorry, no account exist with those credentials.")
      res.status(401).render("account/login", {
        title: "Login"
      })
    }
  } catch (error) {
    console.error("Login error:", error)
    req.flash("notice", "Login failed due to a server error.")
    res.status(500).render("account/login", {
      title: "Login",
      account_email
    })
  }
}

module.exports = { buildLogin, buildRegister,registerAccount, processLogin}