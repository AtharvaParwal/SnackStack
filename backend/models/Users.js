const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BuyerSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true
	},
	contact: {
		type: String,
		required: true
	},
	age: {
		type: Number,
		required: true,
		min: 0
	},
	batchNumber: {
		type: String,
		required: true,
		enum: ["UG1", "UG2", "UG3", "UG4", "UG5"]
	},
	favourites: [Schema.Types.ObjectId]
});

const VendorSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true
	},
	contact: {
		type: String,
		required: true
	},
	shopName: {
		type: String,
		required: true,
		unique: true
	},
	openTime: {
		type: String,
		required: true
	},
	closeTime: {
		type: String,
		required: true
	}
});


const Vendor = mongoose.model("Vendors", VendorSchema);
const Buyer = mongoose.model("Buyers", BuyerSchema);

module.exports = {
	Vendor: Vendor,
	Buyer: Buyer
}