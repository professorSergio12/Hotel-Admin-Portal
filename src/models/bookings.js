const mongoose = require("mongoose")
const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    number: {
        type: Number,
        required: true
    },
    roomType: {
        type: String,
        required: true
    },
    checkin: {
        type: Date,
        required: true
    },
    checkout: {
        type: Date,
        required: true
    },
    duration: {
        type: Number
    },
    amount: {
        type: Number
    },
    displayDatein: {
        type: String
    },
    displayDateout: {
        type: String
    }
});

const Booking = new mongoose.model('Booking', bookingSchema);
module.exports = Booking;