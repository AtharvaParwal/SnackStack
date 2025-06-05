var express = require("express");
var router = express.Router();

const cartlib = require("../middlewares/cartitems");


// import fooditems model
const { FoodItems } = require("../models/FoodItems");


router.get("/fooditems", function (req, res) {
    FoodItems.find(function (err, items) {
        if (err) {
            console.log(err);
        } else {
            res.json(items);
        }
    }).sort({ canteen: 1 });
});

router.post("/addfooditems", (req, res) => {

    const newFood = new FoodItems({
        name: req.body.name,
        price: req.body.price,
        rating: req.body.rating,
        veg: req.body.veg,
        addon: req.body.addon,
        tags: req.body.tags,
        canteen: req.body.canteen,
        img: "image"
    });

    newFood.save()
        .then(item => {
            res.status(200).json(item);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

router.post("/updatefooditem", (req, res) => {
    FoodItems.findById(req.body._id, (err, item) => {
        if (err) {
            console.log(err);
        } else {
            item.name = req.body.name;
            item.price = req.body.price;
            item.rating = req.body.rating;
            item.veg = req.body.veg;
            item.addon = req.body.addon;
            item.tags = req.body.tags;
            item.canteen = req.body.canteen;

            item.save()
                .then(item => {
                    res.status(200).json(item);
                })
                .catch(err => {
                    res.status(400).send(err);
                });
        }
    });
});

router.post("/deletefooditem", (req, res) => {
    FoodItems.findById(req.body._id, (err, item) => {
        if (err) {
            console.log(err);
        } else {
            item.remove()
                .then(item => {
                    res.status(200).json(item);
                })
                .catch(err => {
                    res.status(400).send(err);
                });
        }
    });
});

router.post("/updaterating", (req, res) => {
    FoodItems.findById(req.body.id, (err, item) => {
        if (err) {
            console.log(err);
        } else {
            item.rating = (req.body.rating + item.rating * item.totalreviews) / (item.totalreviews + 1);
            item.totalreviews = item.totalreviews + 1;

            item.save()
                .then(item => {
                    res.status(200).json(item);
                })
                .catch(err => {
                    res.status(400).send(err);
                });
        }
    });
});

module.exports = router;