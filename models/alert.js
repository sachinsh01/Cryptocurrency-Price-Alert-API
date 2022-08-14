const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const alertSchema = new Schema({
    status: String,
    email: String,
    price: {
        type: Number,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Alert", alertSchema);