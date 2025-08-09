const mongoose = require("mongoose");
const { Schema } = mongoose;

const AddonSchema = new Schema({
    addon: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true, 
        min: 0 
    }
});

const FoodItemSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
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
        default: 0, 
        min: 0, 
        max: 5 
    },
    veg: { 
        type: Boolean, 
        required: true 
    },
    addon: [AddonSchema],
    tags: [String],
    canteen: { 
        type: String, 
        required: true 
    },
    totalreviews: { 
        type: Number, 
        default: 0 
    }
}, { 
    timestamps: true 
});

const FoodItem = mongoose.model("FoodItem", FoodItemSchema);

module.exports = { FoodItem };
