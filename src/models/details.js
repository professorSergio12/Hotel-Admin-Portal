const mongoose = require("mongoose")
const detail = mongoose.Schema({
    Catagory: String,
    roomName: String,
    imageUrl: String,
    cost: Number,
})

const DetailModel = mongoose.model("detail", detail); //(collection name , schema name)

module.exports = DetailModel;