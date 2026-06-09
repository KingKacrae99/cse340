const { name } = require("ejs")
const invModel = require("../models/inventory-model")
const detailsUtil = require("./car-detail")
const Util = {}

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
Util.buildClassificationGrid = async function(data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../inv/details/' + vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + 'details"><img src="/' + vehicle.inv_thumbnail
            + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr/>'
            grid += '<h2>'
            grid += '<a href="../inv/details/' + vehicle.inv_id + '" title="View '
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

module.exports = Util