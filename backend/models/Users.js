const mongoose = require("mongoose");
const { Schema } = mongoose;

const BuyerSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    age: { type: Number, required: true, min: 0 },
    batchNumber: { type: String, required: true, enum: ["UG1", "UG2", "UG3", "UG4", "UG5"] },
    favourites: [{ type: Schema.Types.ObjectId, ref: "FoodItem" }]
}, { timestamps: true });

const VendorSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    shopName: { type: String, required: true, unique: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true }
}, { timestamps: true });

const Buyer = mongoose.model("Buyer", BuyerSchema);
const Vendor = mongoose.model("Vendor", VendorSchema);
module.exports = { Buyer, Vendor };


// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// // Create Schema
// const BuyerSchema = new Schema({
// 	name: {
// 		type: String,
// 		required: true
// 	},
// 	email: {
// 		type: String,
// 		required: true,
// 		unique: true,
// 		lowercase: true
// 	},
// 	password: {
// 		type: String,
// 		required: true
// 	},
// 	contact: {
// 		type: String,
// 		required: true
// 	},
// 	age: {
// 		type: Number,
// 		required: true,
// 		min: 0
// 	},
// 	batchNumber: {
// 		type: String,
// 		required: true,
// 		enum: ["UG1", "UG2", "UG3", "UG4", "UG5"]
// 	},
// 	favourites: [Schema.Types.ObjectId]
// });

// const VendorSchema = new Schema({
// 	name: {
// 		type: String,
// 		required: true
// 	},
// 	email: {
// 		type: String,
// 		required: true,
// 		unique: true,
// 		lowercase: true
// 	},
// 	password: {
// 		type: String,
// 		required: true
// 	},
// 	contact: {
// 		type: String,
// 		required: true
// 	},
// 	shopName: {
// 		type: String,
// 		required: true,
// 		unique: true
// 	},
// 	openTime: {
// 		type: String,
// 		required: true
// 	},
// 	closeTime: {
// 		type: String,
// 		required: true
// 	}
// });


// const Vendor = mongoose.model("Vendors", VendorSchema);
// const Buyer = mongoose.model("Buyers", BuyerSchema);

// module.exports = {
// 	Vendor: Vendor,
// 	Buyer: Buyer
// }