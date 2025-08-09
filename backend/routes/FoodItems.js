const express = require("express");
const router = express.Router();
const { FoodItem } = require("../models/FoodItems");
const { verifyToken, verifyUserType } = require("../middlewares/auth");

// Get all food items with optional filtering
router.get("/fooditems", async (req, res) => {
    try {
        let query = {};
        
        // Add filters based on query parameters
        if (req.query.veg !== undefined) {
            query.veg = req.query.veg === 'true';
        }
        if (req.query.canteen) {
            query.canteen = req.query.canteen;
        }
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
        }
        
        let items = await FoodItem.find(query).sort({ canteen: 1 });
        
        // Fuzzy search implementation
        if (req.query.search) {
            const searchTerm = req.query.search.toLowerCase();
            items = items.filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                item.canteen.toLowerCase().includes(searchTerm)
            );
        }
        
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get food items by vendor/canteen
router.get("/vendor/:canteen", async (req, res) => {
    try {
        const items = await FoodItem.find({ canteen: req.params.canteen });
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Add food item (Vendor only)
router.post("/addfooditems", verifyToken, verifyUserType('vendor'), async (req, res) => {
    try {
        const newFood = new FoodItem({
            name: req.body.name,
            img: req.body.img || "image",
            price: req.body.price,
            rating: req.body.rating || 0,
            veg: req.body.veg,
            addon: req.body.addon,
            tags: req.body.tags,
            canteen: req.body.canteen
        });

        const saved = await newFood.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// Update food item (Vendor only)
router.post("/updatefooditem", verifyToken, verifyUserType('vendor'), async (req, res) => {
    try {
        const updated = await FoodItem.findByIdAndUpdate(
            req.body._id,
            {
                name: req.body.name,
                price: req.body.price,
                rating: req.body.rating,
                veg: req.body.veg,
                addon: req.body.addon,
                tags: req.body.tags,
                canteen: req.body.canteen
            },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Food item not found" });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// Delete food item (Vendor only)
router.post("/deletefooditem", verifyToken, verifyUserType('vendor'), async (req, res) => {
    try {
        const deleted = await FoodItem.findByIdAndDelete(req.body._id);
        if (!deleted) return res.status(404).json({ error: "Food item not found" });
        res.json(deleted);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// Update rating
router.post("/updaterating", async (req, res) => {
    try {
        const item = await FoodItem.findById(req.body.id);
        if (!item) return res.status(404).json({ error: "Food item not found" });

        item.rating = (req.body.rating + item.rating * item.totalreviews) / (item.totalreviews + 1);
        item.totalreviews += 1;

        await item.save();
        res.json(item);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;