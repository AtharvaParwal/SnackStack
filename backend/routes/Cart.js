import { getCartItems, getCartTotal } from "../middlewares/cartitems";
var express = require("express");
var router = express.Router();

const {Cart} = require("../models/Cart");


router.get("/allcart", function(req, res) {
    Cart.find(function(err, items) {
        if (err) {
            console.log(err);
        } else {
            res.json(items);
        }
    })
});

router.post("/getitems", (req, res) => {
    const email = req.body.email;
    Cart.findOne({email: email}, function(err, item) {
        if (err) {
            return res.status(404).json({
                error: "Email not found",
            });
        } else {
            const itempairs = item.items;
            const items = getCartItems(itempairs);
            res.json({items: items, data: item});
        }
    })
});

router.post("/additem", (req, res) => {
    const email = req.body.email;
    const item = req.body.item;
    Cart.findOne({email: email}, function(err, user) {
        if (err) {
            return res.status(404).json({
                error: "Email not found",
            });
        } else {
            var flag = 0;
            for (let i = 0; i < user.items.length; i++) {
                if (user.items[i].item === item) {
                    user.items[i].quantity = user.items[i].quantity + 1;
                    flag = 1;
                }
            }
            if (flag === 0) {
                user.items.push({item: item, quantity: 1});
            }
            user.save();
            res.json(user.items);
        }
    })
});

router.post("/removeitem", (req, res) => {
    const email = req.body.email;
    const item = req.body.item;
    Cart.findOne({email: email}, function(err, user) {
        if (err) {
            return res.status(404).json({
                error: "Email not found",
            });
        } else {
            for (let i = 0; i < user.items.length; i++) {
                if (user.items[i].item === item) {
                    if(user.items[i].quantity > 1) {
                        user.items[i].quantity = user.items[i].quantity - 1;
                    } else {
                        user.items.splice(i, 1);
                    }
                }
            }
            user.save();
            res.json(user.items);
        }
    })
});

router.post("/getcartvalue", (req, res) => {
    const email = req.body.email;
    Cart.findOne({email: email}, function(err, user) {
        if (err) {
            return res.status(404).json({
                error: "Email not found",
            });
        } else {
            const items = getCartItems(user.items);
            const total = getCartTotal(items);
            res.json(total);
        }
    })
});

module.exports = router;