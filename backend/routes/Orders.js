const express = require("express");
const router = express.Router();
const { Order } = require("../models/Orders");
const timelib = require("../middlewares/time");
const { verifyToken, verifyUserType } = require("../middlewares/auth");
const { EmailNotificationService } = require("../middlewares/emailNotification");

// Get all orders
router.get("/allorders", async (req, res) => {
    try {
        const orders = await Order.find().populate("item_id");
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get orders for current user (protected)
router.get("/myorders", verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ email: req.user.email }).populate("item_id");
        res.json(orders);
    } catch (err) {
        console.error("Error fetching user orders:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get orders for vendor (protected)
router.get("/vendororders", verifyToken, verifyUserType(['Vendor']), async (req, res) => {
    try {
        // First get vendor's shop name
        const shopName = req.user.userData.shopName;
        const orders = await Order.find({ canteen: shopName }).populate("item_id");
        res.json(orders);
    } catch (err) {
        console.error("Error fetching vendor orders:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get orders by buyer email
router.post("/getorderbyemail", async (req, res) => {
    try {
        const orders = await Order.find({ email: req.body.email }).populate("item_id");
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get orders by vendor
router.post("/getorderbyvendor", async (req, res) => {
    try {
        const orders = await Order.find({ canteen: req.body.canteen }).populate("item_id");
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Place new order (JWT protected)
router.post("/placeorder", verifyToken, async (req, res) => {
    try {
        console.log("Place order request received");
        console.log("User from JWT:", req.user);
        console.log("Request body:", req.body);
        
        const newOrder = new Order({
            email: req.user.email, // Get email from JWT token
            placedTime: new Date(), // Use proper Date object instead of time string
            item: req.body.item,
            canteen: req.body.canteen,
            quantity: req.body.quantity,
            cost: req.body.cost,
            status: "PLACED",
            rating: req.body.rating,
            item_id: req.body.item_id,
            addons: req.body.addons || []
        });

        console.log("Creating order:", newOrder);
        const saved = await newOrder.save();
        console.log("Order saved successfully:", saved);
        
        // Send email notification to buyer
        try {
            await EmailNotificationService.sendOrderConfirmation(saved);
            console.log("Order confirmation email sent to buyer");
        } catch (emailErr) {
            console.error("Failed to send order confirmation email:", emailErr);
            // Don't fail the order placement if email fails
        }
        
        res.status(201).json(saved);
    } catch (err) {
        console.error("Error placing order:", err);
        res.status(400).json({ error: err.message });
    }
});

// Update order status (JWT protected)
router.post("/updatestatus", verifyToken, async (req, res) => {
    try {
        console.log("Update order status request:", req.body);
        const updated = await Order.findByIdAndUpdate(req.body.id, { status: req.body.status }, { new: true });
        if (!updated) return res.status(404).json({ error: "Order not found" });
        console.log("Order status updated:", updated);
        
        // Send email notification to buyer about status update
        try {
            await EmailNotificationService.sendStatusUpdate(updated, req.body.status);
            console.log("Status update email sent to buyer");
        } catch (emailErr) {
            console.error("Failed to send status update email:", emailErr);
            // Don't fail the status update if email fails
        }
        
        res.json(updated);
    } catch (err) {
        console.error("Error updating order status:", err);
        res.status(400).json({ error: err.message });
    }
});

// Mark order as rated (JWT protected)
router.post("/rated", verifyToken, async (req, res) => {
    try {
        console.log("Mark order as rated:", req.body);
        const updated = await Order.findByIdAndUpdate(req.body.id, { rated: true }, { new: true });
        if (!updated) return res.status(404).json({ error: "Order not found" });
        console.log("Order marked as rated:", updated);
        res.json(updated);
    } catch (err) {
        console.error("Error marking order as rated:", err);
        res.status(400).json({ error: err.message });
    }
});

// Get order analytics for vendor
router.post("/analytics", async (req, res) => {
    try {
        const { canteen } = req.body;
        if (!canteen) return res.status(400).json({ error: "Canteen is required" });

        // Get total revenue
        const revenueResult = await Order.aggregate([
            { $match: { canteen: canteen, status: { $in: ["DELIVERED", "PICKED_UP"] } } },
            { $group: { _id: null, totalRevenue: { $sum: "$cost" } } }
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // Get top 5 items
        const topItems = await Order.aggregate([
            { $match: { canteen: canteen } },
            { $group: { 
                _id: "$item", 
                totalOrders: { $sum: "$quantity" },
                totalRevenue: { $sum: "$cost" }
            }},
            { $sort: { totalOrders: -1 } },
            { $limit: 5 }
        ]);

        // Get order status breakdown
        const statusBreakdown = await Order.aggregate([
            { $match: { canteen: canteen } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Get recent orders
        const recentOrders = await Order.find({ canteen })
            .sort({ placedTime: -1 })
            .limit(10)
            .populate("item_id");

        res.json({
            totalRevenue,
            topItems,
            statusBreakdown,
            recentOrders
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get order statistics by date range
router.post("/stats", async (req, res) => {
    try {
        const { canteen, startDate, endDate } = req.body;
        
        let matchStage = { canteen };
        if (startDate && endDate) {
            matchStage.placedTime = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const stats = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$cost" },
                    avgOrderValue: { $avg: "$cost" },
                    totalItems: { $sum: "$quantity" }
                }
            }
        ]);

        res.json(stats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0, totalItems: 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;