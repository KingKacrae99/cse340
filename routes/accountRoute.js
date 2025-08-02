const express = require("express")
const router = new express.Router()
const utilities = require('../utilities/')
const Validate = require('../utilities/account-validation')
const accountController= require('../controllers/accountController')

router.get('/login', utilities.handlerErrors(accountController.buildLogin))
router.get('/registration', utilities.handlerErrors(accountController.buildRegister))
/************************Registration post*************************** */
router.post('/register', Validate.registationRules(), Validate.checkRegData, utilities.handlerErrors(accountController.registerAccount))
// Process the login attempt
router.post('/login', Validate.loginRules, Validate.checkLogData, utilities.handlerErrors(accountController.processLogin))

module.exports = router;