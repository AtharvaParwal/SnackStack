// backend/middlewares/orderValidation.js
const { Wallet } = require("../models/Wallet");
const { Vendor } = require("../models/Users");
const { validateCartItems } = require("./cartitems");
const { check_if_shop_open } = require("./time");

// Validate order placement requirements
async function validateOrderPlacement(req, res, next) {
    try {
        const { email, canteen, items, totalCost } = req.body;

        // 1. Validate required fields
        if (!email || !canteen || !items || !totalCost) {
            return res.status(400).json({
                error: "Missing required fields: email, canteen, items, totalCost"
            });
        }

        // 2. Check wallet balance
        const wallet = await Wallet.findOne({ email });
        if (!wallet) {
            return res.status(404).json({
                error: "Wallet not found for user"
            });
        }

        if (wallet.balance < totalCost) {
            return res.status(400).json({
                error: "Insufficient wallet balance",
                required: totalCost,
                available: wallet.balance,
                code: "INSUFFICIENT_BALANCE"
            });
        }

        // 3. Check vendor availability
        const vendor = await Vendor.findOne({ shopName: canteen });
        if (!vendor) {
            return res.status(404).json({
                error: "Vendor not found"
            });
        }

        const isShopOpen = check_if_shop_open(vendor.openTime, vendor.closeTime);
        if (!isShopOpen) {
            return res.status(400).json({
                error: "Shop is currently closed",
                openTime: vendor.openTime,
                closeTime: vendor.closeTime,
                code: "SHOP_CLOSED"
            });
        }

        // 4. Validate cart items
        const validation = await validateCartItems(items);
        if (!validation.isValid) {
            return res.status(400).json({
                error: "Invalid items in cart",
                invalidItems: validation.invalidItems,
                code: "INVALID_ITEMS"
            });
        }

        // Add validation results to request for use in next middleware
        req.validationData = {
            wallet,
            vendor,
            validItems: validation.validItems
        };

        next();
    } catch (err) {
        console.error("Order validation error:", err);
        res.status(500).json({ error: "Order validation failed" });
    }
}

// Validate order status updates
function validateStatusUpdate(req, res, next) {
    const { status } = req.body;
    const validStatuses = ["PLACED", "CONFIRMED", "PREPARING", "READY", "PICKED_UP", "DELIVERED", "CANCELLED"];
    
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
            error: "Invalid status",
            validStatuses,
            provided: status
        });
    }
    
    next();
}

// Check if user can update order status (vendor-only operations)
async function checkVendorPermission(req, res, next) {
    try {
        const { canteen, vendorEmail } = req.body;
        
        if (!vendorEmail) {
            return res.status(400).json({
                error: "Vendor email required for status updates"
            });
        }

        const vendor = await Vendor.findOne({ email: vendorEmail });
        if (!vendor) {
            return res.status(404).json({
                error: "Vendor not found"
            });
        }

        if (vendor.shopName !== canteen) {
            return res.status(403).json({
                error: "Vendor can only update orders for their own shop"
            });
        }

        next();
    } catch (err) {
        console.error("Vendor permission check error:", err);
        res.status(500).json({ error: "Permission check failed" });
    }
}

module.exports = {
    validateOrderPlacement,
    validateStatusUpdate,
    checkVendorPermission
};
