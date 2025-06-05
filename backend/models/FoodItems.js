const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodItemsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    img: { 
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    veg: {
        type: Boolean,
        required: true
    },
    addon: [{addon: String, price: {
        type: Number,
        required: true,
        min: 0
    }}],
    tags : [String],
    canteen : {
        type: String,
        required: true
    },
    totalreviews : {
        type: Number,
        required: false,
        default: 0
    }
});

const FoodItems = mongoose.model("FoodItems", FoodItemsSchema);

module.exports = {
    FoodItems : FoodItems
};