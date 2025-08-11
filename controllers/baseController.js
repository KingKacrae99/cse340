const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
    const nav = await utilities.getNav()
    //req.flash("notice", "This is a flash message.")
    res.render("index", {
        title: "Home",
        nav,
    }) 
}
baseController.quick = async (req, res, next) => {
    try {
        const nav = utilities.getquick()
        if (!nav) {
            const err = new Error("Oops! no quick link")
            err.status = 500
            next(err)
        } else {
            res.render("errors/error", { title: "Home", nav }) 
        }   
    } catch (err) {
        err.message = "Oops! something went wrong"
        next(err)
    }

}
module.exports = baseController
