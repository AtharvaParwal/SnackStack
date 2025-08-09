// backend/routes/Cart.js
const express = require("express");
const router = express.Router();
const { Cart } = require("../models/Cart");
const { getCartItems, getCartTotal } = require("../middlewares/cartitems");
const mongoose = require("mongoose");

// GET all carts (admin)
router.get("/allcart", async (req, res) => {
  try {
    const items = await Cart.find().populate("items.item");
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get detailed items for a cart
router.post("/getitems", async (req, res) => {
  try {
    const { email } = req.body;
    const cart = await Cart.findOne({ email });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const items = await getCartItems(cart.items); // **await**
    res.json({ items, data: cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add item to cart
router.post("/additem", async (req, res) => {
  try {
    const { email, item } = req.body; // item should be ObjectId string
    let cart = await Cart.findOne({ email });
    if (!cart) {
      cart = new Cart({ email, items: [{ item, quantity: 1 }], total: 0 });
    } else {
      const existing = cart.items.find(i => i.item.equals(item));
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.items.push({ item, quantity: 1 });
      }
    }
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Remove item (decrement or remove)
router.post("/removeitem", async (req, res) => {
  try {
    const { email, item } = req.body;
    const cart = await Cart.findOne({ email });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const existing = cart.items.find(i => i.item.equals(item));
    if (existing) {
      if (existing.quantity > 1) existing.quantity -= 1;
      else cart.items = cart.items.filter(i => !i.item.equals(item));
      await cart.save();
    }
    res.json(cart.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get cart total
router.post("/getcartvalue", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const cart = await Cart.findOne({ email });
    if (!cart) return res.json({ total: 0 }); // Return 0 for empty cart

    const enriched = await getCartItems(cart.items); // get enriched items
    const total = await getCartTotal(enriched);      // pass enriched items
    res.json({ total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Clear cart (useful after order placement)
router.post("/clearcart", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const cart = await Cart.findOne({ email });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = [];
    cart.total = 0;
    await cart.save();
    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;