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



// import { getCartItems, getCartTotal } from "../middlewares/cartitems";
// var express = require("express");
// var router = express.Router();

// const {Cart} = require("../models/Cart");


// router.get("/allcart", function(req, res) {
//     Cart.find(function(err, items) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(items);
//         }
//     })
// });

// router.post("/getitems", (req, res) => {
//     const email = req.body.email;
//     Cart.findOne({email: email}, function(err, item) {
//         if (err) {
//             return res.status(404).json({
//                 error: "Email not found",
//             });
//         } else {
//             const itempairs = item.items;
//             const items = getCartItems(itempairs);
//             res.json({items: items, data: item});
//         }
//     })
// });

// router.post("/additem", (req, res) => {
//     const email = req.body.email;
//     const item = req.body.item;
//     Cart.findOne({email: email}, function(err, user) {
//         if (err) {
//             return res.status(404).json({
//                 error: "Email not found",
//             });
//         } else {
//             var flag = 0;
//             for (let i = 0; i < user.items.length; i++) {
//                 if (user.items[i].item === item) {
//                     user.items[i].quantity = user.items[i].quantity + 1;
//                     flag = 1;
//                 }
//             }
//             if (flag === 0) {
//                 user.items.push({item: item, quantity: 1});
//             }
//             user.save();
//             res.json(user.items);
//         }
//     })
// });

// router.post("/removeitem", (req, res) => {
//     const email = req.body.email;
//     const item = req.body.item;
//     Cart.findOne({email: email}, function(err, user) {
//         if (err) {
//             return res.status(404).json({
//                 error: "Email not found",
//             });
//         } else {
//             for (let i = 0; i < user.items.length; i++) {
//                 if (user.items[i].item === item) {
//                     if(user.items[i].quantity > 1) {
//                         user.items[i].quantity = user.items[i].quantity - 1;
//                     } else {
//                         user.items.splice(i, 1);
//                     }
//                 }
//             }
//             user.save();
//             res.json(user.items);
//         }
//     })
// });

// router.post("/getcartvalue", (req, res) => {
//     const email = req.body.email;
//     Cart.findOne({email: email}, function(err, user) {
//         if (err) {
//             return res.status(404).json({
//                 error: "Email not found",
//             });
//         } else {
//             const items = getCartItems(user.items);
//             const total = getCartTotal(items);
//             res.json(total);
//         }
//     })
// });

// module.exports = router;