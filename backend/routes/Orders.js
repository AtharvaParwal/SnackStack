const timelib = require("../middlewares/time");

var express = require("express");
var router = express.Router();

const { Order } = require("../models/Orders");



router.get("/allorders", function (req, res) {
    Order.find(function (err, orders) {
        if (err) {
            console.log(err);
        } else {
            res.json(orders);
        }
    })
});

router.post("/getorderbyemail", (req, res) => {
    Order.find({ email: req.body.email }, function (err, orders) {
        if (err) {
            console.log(err);
        } else {
            res.json(orders);
        }
    })
});

router.post("/getorderbyvendor", (req, res) => {
    // console.log(req.body.canteen);
    Order.find({ canteen: req.body.canteen }, function (err, orders) {
        if (err) {
            console.log(err);
        } else {
            res.json(orders);
        }
    })
});

router.post("/placeorder", (req, res) => {
    const newOrder = new Order({
        email: req.body.email,
        placedTime: timelib.get_current_time(),
        item: req.body.item,
        canteen: req.body.canteen,
        quantity: req.body.quantity,
        cost: req.body.cost,
        status: "PLACED",
        rating: req.body.rating,
        item_id: req.body.item_id,
        addons: req.body.addons
    });
    newOrder.save()
        .then(order => {
            res.status(200).json(order);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

router.post("/updatestatus", (req, res) => {
    Order.updateOne({ _id: req.body.id }, { status: req.body.status }, function (err, order) {
        if (err) {
            console.log(err);
        } else {
            res.json(order);
        }
    })
});

router.post("/rated", (req, res) => {
    Order.updateOne({ _id: req.body.id }, { rated: true }, function (err, order) {
        if (err) {
            console.log(err);
        } else {
            res.json(order);
        }
    })
});

module.exports = router;