const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    items: [{item : Schema.Types.ObjectId, quantity: Number}],
    total: {
        type: Number,
    }
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = {
    Cart : Cart
};
