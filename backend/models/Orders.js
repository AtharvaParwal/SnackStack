const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    placedTime: {
        type: String,
        required: true
    },
    canteen: {
        type: String,
        required: true
    },
    item: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    cost: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ["PLACED", "ACCEPTED", "COOKING", "READY FOR PICKUP", "COMPLETED", "REJECTED"]
    },
    rating: {
        type: Number,
        required: false,
        min: 0
    },
    item_id: {
        type: Schema.Types.ObjectId,
        ref: "FoodItems"
    },
    addons: [String],
    rated: {
        type: Boolean,
        required: false,
        default: false
    }
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = {
    Order: Order
};
