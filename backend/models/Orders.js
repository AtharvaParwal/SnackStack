const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
    email: { 
        type: String, 
        required: true, 
        lowercase: true, 
        trim: true 
    },
    placedTime: { 
        type: Date, 
        default: Date.now 
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
        min: 1 
    },
    cost: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    status: {
        type: String,
        required: true,
        enum: ["PLACED", "ACCEPTED", "COOKING", "READY FOR PICKUP", "COMPLETED", "REJECTED"],
        default: "PLACED"
    },
    rating: { 
        type: Number, 
        min: 0, 
        max: 5 
    },
    item_id: { 
        type: Schema.Types.ObjectId, 
        ref: "FoodItem" 
    },
    addons: [String],
    rated: { 
        type: Boolean, 
        default: false 
    }
}, { 
    timestamps: true 
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order };
