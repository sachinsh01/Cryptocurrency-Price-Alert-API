const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    /* rToken: [{
        type: String
    }] */
    rToken: {
        type: String
    }
})

module.exports = mongoose.model("User", userSchema);