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
    //req.flash("confirmation", "You're logged in")
    let isStaff = false;
    const accountData = res.locals.accountData
    if (accountData.account_type == "Employee" ||
      accountData.account_type == "Admin") {
      isStaff = true;
      console.log( "ACCOUNT TYPE :" ,accountData.account_type)
    }    
    console.log("Account page:", res.locals)
    res.status(200).render("account/account", {
      title: "User Account",
      nav,
      isStaff,
      accountData,
      errors: null
    })
  } catch (err) {
    next(err)
  }
}

/**********************************************
 *  Build Account Edit View
 *********************************************/
async function accountSetting(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  const nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/profile-settings", {
    title: "Profile Settings",
    nav,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    errors: null
  })
}

/***************************************************
 *   Process Update Account Information
 **************************************************/
async function updateProfile(req, res, next) {
  const nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id
  } = req.body
  const updatedInfo = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )
  if (updatedInfo) {
    const fullname = `${updatedInfo.account_firstname} ${updatedInfo.account_lastname}`
    req.flash("confirmation", `Congratulation ${fullname}! Your information has been successfully updated.`)
    return res.redirect('/account/')
  } else {
    req.flash("notice", "Oops, the update process failed. ")
    res.status(500).render("account/profile-settings", {
      title: "Profile Settings",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
}

/***************************************************************
 *  Process Changed Password 
 **************************************************************/
async function changePassword(req, res, next) {
  const nav = await utilities.getNav();
  const { account_password, new_account_password, account_id } = req.body;
  const userData = await accountModel.getAccountById(account_id);

  // Prevent same password reuse
  if (account_password === new_account_password) {
    req.flash("notice", "Your new password must be different from the current password.");
     return res.status(400).render("account/profile-settings", {
        title: "Profile Settings",
        nav,
        errors: null,
        account_firstname: userData.account_firstname,
        account_lastname: userData.account_lastname,
       account_email: userData.account_email,
       account_id: userData.account_id
    });
  }

  try {
    // Get user data
    const userData = await accountModel.getAccountById(account_id);
    console.log("account_id from form:", account_id);
    console.log("userData from DB:", userData);


    // Compare current password with stored hashed password
    const match = await bcrypt.compare(account_password, userData.account_password);
    if (!match) {
      req.flash("notice", "Please check your current password and try again.");
      return res.status(400).render("account/profile-settings", {
        title: "Profile Settings",
        nav,
        errors: null,
        account_firstname: userData.account_firstname,
        account_lastname: userData.account_lastname,
        account_email: userData.account_email,
        account_id: userData.account_id
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(new_account_password, 10);

    const passResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (passResult) {
      req.flash("confirmation", "Password was successfully changed.");
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Password update failed. Please try again.");
      return res.status(500).render("account/profile-settings/", {
        title: "Profile Settings",
        nav,
        errors: null,
      });
    }

  } catch (err) {
    console.error("Password change error:", err);
    next(err); 
  }
}

async function logout(req, res, next) {
  if (res.locals.loggedin) {
    res.clearCookie("jwt")
    req.flash("confirmation", "You've been successfully Logged Out")
    res.redirect('/')
  } else {
    req.flash("notice", "Please login")
    res.redirect("account/login")
  }
}

module.exports = {
  buildLogin, buildRegister, registerAccount,
  processLogin, defaultAccount, accountSetting,
  updateProfile,changePassword, logout
}