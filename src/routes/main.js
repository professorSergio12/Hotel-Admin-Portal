const express = require("express");
const routes = express.Router()
const detail = require('../models/details')
const booking = require('../models/bookings')


routes.get('/', async (req, res) => {
    // res.send("this is good");
    // const Details = await detail.findOne({"_id":"659806387f861b1d1162b409"})
    const DetailsA = await detail.find({ "Catagory": "DR", });
    const DetailsB = await detail.find({ "Catagory": "LR", });
    const DetailsC = await detail.find({ "Catagory": "SR", });

    // console.log(Details)
    res.render("index", {
        DetailsA: DetailsA,
        DetailsB: DetailsB,
        DetailsC: DetailsC
    })
})


routes.get('/about', async (req, res) => {
    res.render("about")
})

routes.get('/bookings', async (req, res) => {

    const allBookings = await booking.find();
    res.render('bookings', { allBookings: allBookings });
})

routes.post('/bookings', async (req, res) => {
    try {
        const roomType = req.body.roomType;
        const checkin = new Date(req.body.checkin);
        const checkout = new Date(req.body.checkout);
        const durationInMilliseconds = checkout.getTime() - checkin.getTime();

        const duration = Math.ceil((durationInMilliseconds) / (1000 * 60 * 60));
        // console.log(req.body.roomType);

        // Calculate the amount based on room type
        var amount = duration;
        switch (roomType) {
            case 'DR':
                amount = duration * 100;
                break;
            case 'LR':
                amount = duration * 80;
                break;
            case 'SR':
                amount = duration * 50;
                break;
            default:
                break;
        }
        // console.log(duration);
        // console.log(amount);
        const formattedCheckin = checkin.toISOString().slice(0, 16).replace('T', ' ');
        const formattedCheckout = checkout.toISOString().slice(0, 16).replace('T', ' ');

        const bookingSchema = new booking({
            name: req.body.name,
            email: req.body.email,
            number: req.body.number,
            roomType: req.body.roomType,
            checkin: checkin,
            checkout: checkout,
            duration: duration,
            amount: amount,
            displayDatein: formattedCheckin,
            displayDateout: formattedCheckout
        })
        console.log(bookingSchema);
        await bookingSchema.save().then(() => {
            console.log("booking schema");
            res.redirect("/");
        });
    } catch (err) {
        res.status(400).send(err)
    }
})

routes.get('/filter/submit', async (req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const roomType = req.query.roomType;

    console.log(roomType);
    console.log(startDate);
    console.log(endDate);

    try {
        let roomData;

        if (startDate !== '' && endDate !== '' && roomType != 'All') {
            // If all three conditions are present, filter with compound query
            roomData = await booking.find({
                checkin: { $gte: new Date(startDate) },
                checkout: { $lte: new Date(endDate) },
                roomType: roomType
            });
        } else if (startDate !== '' && endDate !== '' && roomType == 'All') {
            // If only date conditions are present, filter without roomType
            roomData = await booking.find({
                checkin: { $gte: new Date(startDate) },
                checkout: { $lte: new Date(endDate) }
            });
        } else if (roomType !== 'ALL') {
            // If only roomType condition is present
            roomData = await booking.find({ roomType: roomType });
        } else {
            // If no specific conditions are present, return all bookings
            roomData = await booking.find();
        }
        // console.log(roomData);
        res.json(roomData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

routes.get("/bookings-delete", async (req, res) => {
    const emailData = req.query.email;
    console.log("yes", emailData);
    booking.deleteOne({ email: emailData }).then(() => {
        console.log("Successfully Deleted");
        res.redirect("/bookings");
    });

})

routes.get("/amounts", async (req, res) => {
    const emailData = req.query.email;
    amountData = await booking.find({ email: emailData });
    // console.log(amountData);
    res.json(amountData);
})


routes.post("/update", async (req, res) => {
    const roomType = req.body.roomType;
    const checkin = new Date(req.body.checkin);
    const checkout = new Date(req.body.checkout);
    const durationInMilliseconds = checkout.getTime() - checkin.getTime();

    const duration = Math.ceil((durationInMilliseconds) / (1000 * 60 * 60));
    // console.log(req.body.roomType);

    // Calculate the amount based on room type
    var amount = duration;
    switch (roomType) {
        case 'DR':
            amount = duration * 100;
            break;
        case 'LR':
            amount = duration * 80;
            break;
        case 'SR':
            amount = duration * 50;
            break;
        default:
            break;
    }
    // console.log(duration);
    // console.log(amount);
    const formattedCheckin = checkin.toISOString().slice(0, 16).replace('T', ' ');
    const formattedCheckout = checkout.toISOString().slice(0, 16).replace('T', ' ');

    const bookingData = new booking({
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        roomType: req.body.roomType,
        checkin: checkin,
        checkout: checkout,
        duration: duration,
        amount: amount,
        displayDatein: formattedCheckin,
        displayDateout: formattedCheckout
    })
    console.log(bookingData);
    booking.updateOne(
        { email: req.body.email },
        {
            $set: {
                name: req.body.name,
                email: req.body.email,
                number: req.body.number,
                roomType: req.body.roomType,
                checkin: checkin,
                checkout: checkout,
                duration: duration,
                amount: amount,
                displayDatein: formattedCheckin,
                displayDateout: formattedCheckout
            }
        }
    ).then(result => {
        console.log("Update Succesfull");
        // res.status(200).json({ message: "Update successful!" });
    });
})
module.exports = routes
