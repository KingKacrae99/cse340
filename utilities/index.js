const { name } = require("ejs")
const invModel = require("../models/inventory-model")
const detailsUtil = require("./car-detail")
const classificationUtil = require("./classification")
const Util = {}

Util.checkLoginStatus = (req, res, next) =>{
    if (req.session.account && req.session.account){
        res.locals.user= req.session.account;
        res.locals.loggedin = true;
    }else{
        res.locals.user = null;
        res.locals.loggedin = false;
    }
    next();
}

/* ******************************************
* Check Login Status to Protect Routes
* **************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next() // User is authenticated! Move on to the next controller function.
  } else {
    req.flash("notice", "Please log in to access this feature.")
    return res.redirect("/account/login")
  }
}
/* ******************************************
* Check Login Status to Protect Routes
* **************************************** */
Util.checkRole = (req, res, next) => {
    if (res.locals.loggedin) {
        const user = res.locals.user;
        if(user.account_type === 'Admin'){
            next();
        }else{
            req.flash("notice", "Unauthorized access! Please contact admin for access");
            return res.redirect("/");
        }

    } else {
        req.flash("notice", "Please log in to access this feature.")
        return res.redirect("/account/login")
    }
}
/* **************************************
* Constructs the nav HTML unordered list
************************************   */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    console.log(data)
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name + 
            'vehicles">' +
            row.classification_name +
            "</a>"
    })
    list += "</ul>"
    return list
}

/* ***************************************************************
* Build the classification view HTML
* ***************************************************************/
Util.buildClassificationGrid = async function(data,likedCars) {
    let grid = await classificationUtil.buildClassificationPage(data,likedCars);
    return grid;
}

Util.buildInventDetails = async function (data) {
    return detailsUtil.buildCarDetails(data)
}

Util.buildDropdown = async function (data) {
    let select
    if (data.length > 0) {
        select = `<select id="classification_id" name="classification_id" required>
                  <option value="">Choose a Classification</option>`
        data.forEach(row => {
            select += '<option value="'+ row.classification_id + '">'
            + row.classification_name +
            '</option >'
        })
        select += '</select>'
    } else {
        select = `<select id="classification_id" disabled>
        <option> No options available </option>
        </select>`
    }
    return select
}

Util.buildUpdateDropdown = async function (data, selectedId) {
  let select = `<select id="classification_id" name="classification_id" required>
                <option value="">Choose a Classification</option>`;
  if (data.length > 0) {
    data.forEach(row => {
      const selected = row.classification_id === selectedId ? ' selected' : '';
      select += `<option value="${row.classification_id}"${selected}>
                 ${row.classification_name}
                 </option>`;
    });
  } else {
    select = `<select id="classification_id" disabled>
              <option>No options available</option>
              </select>`;
  }
  select += `</select>`;
  return select;
}

function addCommasAndCurrency(dataprice){
    price = Number(dataprice).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    })
    return price;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 * Util.handleErrors = - declares the property which is appended to the "Util" object.
 * fn => (req, res, next) => accepts request, response, and next as parameters along with another arrow function.
 * Promise.resolve(fn(req, res, next)) a "wrapper" accepts a function as a parameter of the "Promise.resolve" function
 **************************************** */
Util.handlerErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next).catch(next))


/**************************************************
 * Check Login
 **************************************************/
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

/***********************************************
 * Check Rights 
************************************************/
Util.checkRights = (req, res, next) => {
    const staff = ['Employee', 'Admin']
    console.log("account type :", res.locals.accountData.account_type)
    const account_type = res.locals.accountData.account_type
    console.log("account type result:",account_type) 
    if (isStaff(account_type)) {
        next()
    } else {
        if (res.locals.loggedin) {
            req.flash("unauthorized", "Unauthorized Access!")
            return res.redirect("/account/")
        } else {
           req.flash("notice", "Access Denied! Please log in.")
           return res.redirect("/account/login") 
        }
    }
}

/********************************************
 * Checks account role
********************************************/
function isStaff(accountType){
    const role = ['Employee', 'Admin']
    let staff = false;
    if (role.includes(accountType)) {
     staff = true;
    }
    return staff
}

module.exports = Util