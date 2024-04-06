const express = require("express");
const hbs = require("hbs")
const mongoose = require("mongoose")
const routes = require('./routes/main')
const detail = require('./models/details')
const booking = require('./models/bookings')
const bodyParser = require('body-parser');
const app = express()
require('dotenv').config()

// const path = require('path');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Middleware for static files and routes
app.use('/static', express.static('public'));
app.use('', routes)

app.set('view engine', 'hbs')
app.set("views", "views") //where we store the views files:- in "view folder"
hbs.registerPartials("views/partials")

//db connection
mongoose.connect("mongodb://localhost:27017/website_tut")
    .then(() => {
        console.log("Connected to MongoDB");
        // detail.create({
        //     Catagory: "DR",
        //     roomName: "Exortic DR-1",
        //     imageUrl: "../static/images/room-1.jpg",
        //     cost: 200,
        // })
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

app.listen(process.env.PORT | 5556, () => {
    console.log("server started");
})