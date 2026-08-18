require("dotenv").config();
const utilities = require("../utilities/");
const baseController = {};
const invmodel = require("../models/inventory-model");
const favModel = require("../models/favoriteModel");
const { Result } = require("pg");

baseController.buildHome = async function (req, res) {

    const featuredCars = res.locals.featuredCars;
    const topCars = res.locals.topCars;
    let likedCars;

    if (res.locals.loggedin) {
        const account_id = res.locals.user.account_id;
        likedCars = await favModel.likedCars(account_id)
    }else{
        likedCars = []
    }

    res.render("index", {
        title: "Home",
        featuredCars,
        topCars,
        likedCars,
        currentPath: req.originalUrl,
    });
};

baseController.currentWeather = async (req, res, next) => {
    try {
        const apiKey = process.env.WEATHER_API_KEY;
        const location = "Nigeria";

        const response = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`
        );

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch weather data" });
        }

        const data = await response.json();
        return res.status(200).json({
            success: true,
            result: data,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = baseController;
