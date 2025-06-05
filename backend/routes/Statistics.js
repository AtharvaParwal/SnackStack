var express = require("express");
var router = express.Router();


const { Order } = require("../models/Orders");

router.get("/", function (req, res) {
    Order.aggregate([
        {
            $lookup: {
                from: "buyers",
                localField: "email",
                foreignField: "email",
                as: "buyer"
            }
        }]).then(function (orders) {
            res.send(orders);
        }
        );
});

module.exports = router;

