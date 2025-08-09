var express = require("express");
var router = express.Router();
const { Order } = require("../models/Orders");
const { FoodItem } = require("../models/FoodItems");
const { Buyer, Vendor } = require("../models/Users");

// Get comprehensive platform statistics
router.get("/", async (req, res) => {
    try {
        // Get orders with buyer details
        const orders = await Order.aggregate([
            {
                $lookup: {
                    from: "buyers", // Make sure this matches the collection name in Mongo
                    localField: "email",
                    foreignField: "email",
                    as: "buyer"
                }
            },
            {
                $lookup: {
                    from: "fooditems",
                    localField: "item_id",
                    foreignField: "_id",
                    as: "foodItem"
                }
            }
        ]);

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get platform-wide analytics
router.get("/platform", async (req, res) => {
    try {
        // Total users
        const totalBuyers = await Buyer.countDocuments();
        const totalVendors = await Vendor.countDocuments();
        
        // Total orders and revenue
        const orderStats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$cost" },
                    avgOrderValue: { $avg: "$cost" }
                }
            }
        ]);

        // Most popular items across platform
        const popularItems = await Order.aggregate([
            {
                $group: {
                    _id: "$item",
                    totalOrders: { $sum: "$quantity" },
                    totalRevenue: { $sum: "$cost" }
                }
            },
            { $sort: { totalOrders: -1 } },
            { $limit: 10 }
        ]);

        // Order status distribution
        const statusDistribution = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Active vendors (those with recent orders)
        const activeVendors = await Order.aggregate([
            {
                $match: {
                    placedTime: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
                }
            },
            {
                $group: {
                    _id: "$canteen",
                    orderCount: { $sum: 1 }
                }
            }
        ]);

        res.json({
            users: { totalBuyers, totalVendors },
            orders: orderStats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
            popularItems,
            statusDistribution,
            activeVendors
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get vendor-specific detailed analytics
router.post("/vendor", async (req, res) => {
    try {
        const { canteen } = req.body;
        if (!canteen) return res.status(400).json({ error: "Canteen is required" });

        // Revenue over time (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const revenueOverTime = await Order.aggregate([
            {
                $match: {
                    canteen: canteen,
                    placedTime: { $gte: thirtyDaysAgo },
                    status: { $in: ["DELIVERED", "PICKED_UP"] }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$placedTime" }
                    },
                    revenue: { $sum: "$cost" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Peak hours analysis
        const peakHours = await Order.aggregate([
            { $match: { canteen: canteen } },
            {
                $group: {
                    _id: { $hour: "$placedTime" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { orderCount: -1 } }
        ]);

        // Customer retention (repeat customers)
        const customerRetention = await Order.aggregate([
            { $match: { canteen: canteen } },
            {
                $group: {
                    _id: "$email",
                    orderCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    totalCustomers: { $sum: 1 },
                    repeatCustomers: {
                        $sum: { $cond: [{ $gt: ["$orderCount", 1] }, 1, 0] }
                    }
                }
            }
        ]);

        res.json({
            revenueOverTime,
            peakHours,
            customerRetention: customerRetention[0] || { totalCustomers: 0, repeatCustomers: 0 }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;

