const { name } = require("ejs")
const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require('dotenv').config()

/* **************************************
* Constructs the nav HTML unordered list
************************************   */

Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    console.log(data)
    list += '<li><a href="/" title="Home page">Home</a></li>'
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
Util.buildClassificationGrid = async function(data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../inv/inv/detail/' + vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + 'details"><img src="/' + vehicle.inv_thumbnail
            + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr/>'
            grid += '<h2>'
            grid += '<a href="../inv/inv/detail/' + vehicle.inv_id + '" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + 'details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice"> Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

Util.buildInventDetails = async function (data) {
    let container
    console.log(data.inv_image)
    if (data) {
        container = `<section class="inv-card">
        <div class="inv-card-img">
        <picture>
            <source srcset="/${data.inv_image}" media="(min-width: 735px)">
            <img src="/${data.inv_thumbnail}" alt="${data.inv_year} ${data.inv_make} ${data.inv_model}">
        </picture>
        </div>

        <div class="inv-card-info">
            <h2>${data.inv_make} ${data.inv_model} details</h2>
            <p class="inv-spec"><strong>Price:</strong>
                ${addCommasAndCurrency(data.inv_price)}
            </p>
            <p class="inv-describe"><strong>Description:</strong>
               ${data.inv_description}
            </p>
            <p class="inv-spec"><strong>Color:</strong>
               ${data.inv_color}
            </p>
            <p class="inv-describe"><strong>Miles:</strong>
               ${data.inv_miles}
            </p>
        </div>
        </section>`
    }
    return container
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

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

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

module.exports = Util