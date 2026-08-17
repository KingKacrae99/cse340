const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const invmodel = require("../models/inventory-model");
const bcrypt = require("bcryptjs");

/*************************************************
 * Deliver login view
 ***********************************************/
async function buildLogin(req, res, next) {
    res.render("account/login", {
        title: "Login"
    });
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    });
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    /*** Hash password before storing ***/
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
        console.error("Password hashing error:", error);
        req.flash("notice", "Sorry, there was an error processing the registration.");
        return res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        });
    }

    try {
        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword
        );

        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you're registered ${account_firstname}. Please log in`
            );
            return res.status(201).render("account/login", {
                title: "Login",
                nav,
            });
        } else {
            req.flash("notice", "Sorry, the registration failed.");
            return res.status(501).render("account/register", {
                title: "Registration",
                nav,
            });
        }
    } catch (error) {
        console.error("registerAccount error:", error);
        req.flash("notice", "Registration failed due to a server error.");
        return res.status(500).render("account/register", {
            title: "Registration",
            nav,
        });
    }
}

/* ****************************************
*  Process Login
* *************************************** */
async function processLogin(req, res) {
    try {
        const { account_email, account_password } = req.body;
        const accountData = await accountModel.loginAccount(account_email);

        if (accountData) {
            const passwordMatch = await bcrypt.compareSync(account_password, accountData.account_password);
            if (passwordMatch) {
                req.session.account = accountData;
                delete accountData.account_password;
                return req.session.save((err) => {
                    if (err) {
                        console.error("Session save error:", err);
                        return res.status(500).render("account/login", {
                            title: "Login",
                            account_email
                        });
                    }
                    req.flash("notice", `Welcome back, ${accountData.account_firstname}`);
                    return res.status(200).redirect("/");
                });
            } else {
                req.flash("notice", "Sorry, the password you entered is incorrect.");
                return res.status(401).render("account/login", {
                    title: "Login",
                    account_email
                });
            }
        } else {
            req.flash("notice", "Sorry, no account exists with those credentials.");
            return res.status(401).render("account/login", {
                title: "Login"
            });
        }
    } catch (error) {
        console.error("processLogin error:", error);
        req.flash("notice", "Login failed due to a server error.");
        return res.status(500).render("account/login", {
            title: "Login",
            account_email: req.body.account_email
        });
    }
}

module.exports = { buildLogin, buildRegister, registerAccount, processLogin };
