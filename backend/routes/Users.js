var express = require("express");
var router = express.Router();

const timelib = require("../middlewares/time");

// Load User model
const { Buyer } = require("../models/Users");
const { Wallet } = require("../models/Wallet");

const { Vendor } = require("../models/Users");

// GET request 
// Getting all the users
router.get("/buyers", function (req, res) {
    Buyer.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    })
});

router.get("/vendors", function (req, res) {
    Vendor.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    })
});

router.post("/findbuyer", function (req, res) {
    Buyer.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            res.json(user);
        }
    })
});

router.post("/findvendor", function (req, res) {
    Vendor.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            res.json(user);
        }
    })
});

// update buyer

router.post("/updatebuyer", function (req, res) {
    Buyer.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(404).json({
                error: "Email not found",
            });
        } else {
            user.name = req.body.name;
            user.contact = req.body.contact;
            user.age = req.body.age;
            user.batchNumber = req.body.batchNumber;
            user.favourites = req.body.favourites;
            user.save();
            res.json(user);
        }
    });
});

router.post("/updatevendor", function (req, res) {
    Vendor.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(404).json({
                error: "Email not found",
            });
        } else {
            user.name = req.body.name;
            user.contact = req.body.contact;
            user.shopName = req.body.shopName;
            user.openTime = req.body.openTime;
            user.closeTime = req.body.closeTime;
            user.save();
            res.json(user);
        }
    });
});




// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request 
// Add a user to db
router.post("/Buyerregister", (req, res) => {
    const newUser = new Buyer({
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        password: req.body.password,
        age: req.body.age,
        batchNumber: req.body.batchNumber,
        favourites: req.body.favourites
    });

    const newWallet = new Wallet({
        email: req.body.email,
        balance: 0
    });
    newWallet.save().catch(err => console.log(err));
    newUser.save()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).send(err);
        });


});

router.post("/Vendorregister", (req, res) => {
    const newUser = new Vendor({
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        password: req.body.password,
        shopName: req.body.shopName,
        openTime: req.body.openTime,
        closeTime: req.body.closeTime
    });

    newUser.save()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// POST request 
// Login
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    Vendor.findOne({ email }).then(user => {
        // Check if user email exists
        if (!user) {
            // return res.status(404).json({
            //     error: "Email not found",
            // });
            Buyer.findOne({ email }).then(user2 => {
                if (!user2) {
                    return res.status(404).json({
                        error: "Email not found",
                    });
                }
                else {
                    if (user2.password !== password) {
                        return res.status(401).json({
                            error: "Password incorrect",
                        });
                    }
                    res.send({ message: "Buyer Login successful", user: user2, userType: "Buyer" });
                }
            });
        }
        else {
            // Check if password is correct
            if (user.password !== password) {
                return res.status(401).json({
                    error: "Password incorrect",
                });
            }
            // If everything is correct, return user
            res.send({ message: "Vendor Login successful", user: user, userType: "Vendor" });
        }
    });
});

router.post("/Buyerlogin", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    Buyer.findOne({ email }).then(user => {
        // Check if user email exists
        if (!user) {
            return res.status(404).json({
                error: "Email not found",
            });
        }
        else {
            // Check if password is correct
            if (user.password !== password) {
                return res.status(401).json({
                    error: "Password incorrect",
                });
            }
            // If everything is correct, return user
            res.send({ message: "Login successful", user: user });
        }
    });
});

router.post("/checkshopopen", (req, res) => {
    const shopName = req.body.shopName;
    Vendor.findOne({ shopName }).then(user => {
        if (!user) {
            return res.status(404).json({
                error: "Shop not found",
            });
        }
        else {
            const openTime = user.openTime;
            const closeTime = user.closeTime;
            const isOpen = timelib.check_if_shop_open(openTime, closeTime);
            res.send(isOpen);
        }
    });
});


router.post("/addtofav", (req, res) => {
    const email = req.body.email;
    const id = req.body.id;
    Buyer.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({
                error: "Email not found",
            });
        }
        else {
            user.favourites.push(id);
            user.save();
            res.send(user);
        }
    });
});

router.post("/removefromfav", (req, res) => {
    const email = req.body.email;
    const id = req.body.id;
    Buyer.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({
                error: "Email not found",
            });
        }
        else {
            user.favourites.pull(id);
            user.save();
            res.send(user);
        }
    });
});


// get number of vendors
router.get("/getnumvendors", (req, res) => {
    Vendor.find().then(user => {
        res.send(user.length);
    });
});




module.exports = router;

