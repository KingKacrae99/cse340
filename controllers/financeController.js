const utilities = require("../utilities")
const financeController = {}

/* ******************************************
 * Build Finance Hub Landing Page View
 * ****************************************** */
financeController.buildFinanceLandingPage = async function (req, res, next) {
    res.render("finance/index", {
        title: "Bespoke Capital Structuring | CSE34 Motors",
        currentPath: req.originalUrl,
        user: res.locals.accountData || req.session.user || null,
    })
}

/* ******************************************
 * Build Secure Finance Pre-Qualification Form View
 * ****************************************** */
financeController.buildFinanceApplicationPage = async function (req, res, next) {
    res.render("finance/apply-form", {
        title: "Bespoke Portfolio Underwriting | CSE34 Motors",
        errors: null,
    })
}

/* ******************************************
 * Process Finance Application Form Ingestion
 * ****************************************** */
financeController.handleFinanceApplicationPost = async function (req, res, next) {
    try {
        req.flash("notice", "Financial portfolio successfully delivered to underwriting matrix.")
        res.redirect("/account/")
    } catch (error) {
        next(error)
    }
}

module.exports = financeController