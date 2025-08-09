const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartItemSchema = new Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: "FoodItem",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const CartSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    items: [CartItemSchema],
    total: {
        type: Number,
        default: 0,
        min: 0
    }
}, { 
    timestamps: true 
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = { Cart };
