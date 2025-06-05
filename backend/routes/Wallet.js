var express = require("express");
var router = express.Router();

const { Wallet } = require("../models/Wallet");

router.get("/allbalance", function (req, res) {
    Wallet.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    })
});

router.post("/getbalance", (req, res) => {
    const email = req.body.email;
    Wallet.findOne({ email }, function (err, user) {
        if (!user) {
            return res.status(404).json({
                error: "Email not found",
            });
        } else {
            res.json(user.balance);
        }
    })
});

router.post("/addbalance", (req, res) => {
    const email = req.body.email;
    const balance = req.body.balance;
    Wallet.findOne({ email }, function (err, user) {
        if (!user) {
            return res.status(404).json({
                error: "Email not found",
            });
        } else {
            if (balance < 0) {
                user.balance = user.balance + 0;
            }
            else {
                user.balance = user.balance + balance;
            }
            user.save();
            res.json(user.balance);
        }
    })
});

router.post("/subtractbalance", (req, res) => {
    const email = req.body.email;
    const balance = req.body.balance;
    Wallet.findOne({ email }, function (err, user) {
        if (!user) {
            return res.status(404).json({
                error: "Email not found",
            });
        } else {
            user.balance = user.balance - balance;
            user.save();
            res.json(user.balance);
        }
    })
});

module.exports = router;