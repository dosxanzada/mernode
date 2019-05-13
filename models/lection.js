let mongoose = require("mongoose");

let lectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    articleBy: {
        type: String,
        required: true
    },
    articleImage:{
        type: String,
        required: false
    }
});

let Lection = module.exports = mongoose.model("Lection", lectionSchema);