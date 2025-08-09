var express = require("express");
var router = express.Router();
const { Order } = require("../models/Orders");
const { FoodItem } = require("../models/FoodItems");
const { Buyer, Vendor } = require("../models/Users");
const { Wallet } = require("../models/Wallet");

// GET request 
// Just a test API to check if server is working properly or not
router.get("/", function(req, res) {
	res.json({ 
		message: "SnackStack API is working properly!",
		timestamp: new Date().toISOString(),
		version: "1.0.0"
	});
});

// Test POST endpoint to verify API connectivity
router.post("/test", function(req, res) {
	console.log("Test POST request received:", req.body);
	res.json({
		message: "POST request working!",
		receivedData: req.body,
		timestamp: new Date().toISOString()
	});
});

// Health check with database connectivity
router.get("/health", async (req, res) => {
	try {
		// Test database connectivity by counting documents
		const [orderCount, foodItemCount, buyerCount, vendorCount, walletCount] = await Promise.all([
			Order.countDocuments(),
			FoodItem.countDocuments(),
			Buyer.countDocuments(),
			Vendor.countDocuments(),
			Wallet.countDocuments()
		]);

		res.json({
			status: "healthy",
			database: "connected",
			timestamp: new Date().toISOString(),
			counts: {
				orders: orderCount,
				foodItems: foodItemCount,
				buyers: buyerCount,
				vendors: vendorCount,
				wallets: walletCount
			}
		});
	} catch (err) {
		console.error("Health check failed:", err);
		res.status(500).json({
			status: "unhealthy",
			database: "disconnected",
			error: err.message,
			timestamp: new Date().toISOString()
		});
	}
});

module.exports = router;
