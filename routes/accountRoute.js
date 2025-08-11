const express = require("express")
const router = new express.Router()
const utilities = require('../utilities/')
const Validate = require('../utilities/account-validation')
const accountController= require('../controllers/accountController')
const validate = require("../utilities/account-validation")

router.get('/login', utilities.handlerErrors(accountController.buildLogin))
router.get('/registration', utilities.handlerErrors(accountController.buildRegister))
/************************Registration post*************************** */
router.post('/register', Validate.registationRules(), Validate.checkRegData, utilities.handlerErrors(accountController.registerAccount))
// Process the login attempt
router.post('/login', Validate.loginRules(), Validate.checkLoginData, utilities.handlerErrors(accountController.processLogin))

// Default Account route
router.get('', utilities.checkLogin, utilities.handlerErrors(accountController.defaultAccount))

// Account Settings route
router.get('/profile-settings/:account_id', utilities.checkLogin, utilities.handlerErrors(accountController.accountSetting))
router.post('/update/',Validate.updateAccountRules(), Validate.checkUpdateData, utilities.handlerErrors(accountController.updateProfile))
router.post('/update-password/', validate.changePasswordRules(), utilities.handlerErrors(accountController.changePassword))
// accountRoute.js
router.get("/logout/", utilities.checkLogin, utilities.handlerErrors(accountController.logout));


module.exports = router;