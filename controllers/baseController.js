require("dotenv").config();
const utilities = require("../utilities/");
const baseController = {}
const invmodel = require("../models/inventory-model");
const { Result } = require("pg");


baseController.buildHome = async function (req, res) {
    //const classifications = await invmodel.getClassifications();
    const featuredCars = await invmodel.getLikedInventorybyClass();
    const topCars = await invmodel.getCarsByLikes();
    //req.flash("notice", "This is a flash message.")
   res.render("index", {title: "Home", featuredCars, topCars, currentPath: req.originalUrl,}) 
}

baseController.currentWeather = async (req,res, next) => {
    try {

        const apiKey = process.env.WEATHER_API_KEY;
        const location = 'Nigeria';

        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);

        if (!response.ok) {
            return res.status(response.status).json({error:'Failed to fetch weather data'});
        }

        const data = await response.json();
        console.log(`Weather Data : ${data}`)
        return res.status(200).json({
            success: true,
            result: data
        });

    } catch (error) {
        next(error)
    }
    
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
