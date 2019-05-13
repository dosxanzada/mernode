const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        // unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        minlength: 7
    },
    email:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    avatar:{
        type: String
    },
    lastName:{
        type: String
    },
    firstName:{
        type: String
    },
    dateBirth:{
        type: Date
    }
});

const User = module.exports = mongoose.model("User", UserSchema);