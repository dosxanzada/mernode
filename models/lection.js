let mongoose = require("mongoose");

let lectionSchema = new mongoose.Schema({
    textBody: {
        type: String,
        required: true
    }
});

let Lection = module.exports = mongoose.model("Lection", lectionSchema);