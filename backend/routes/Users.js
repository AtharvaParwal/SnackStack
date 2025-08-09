var express = require("express");
var router = express.Router();

const timelib = require("../middlewares/time");
const { Buyer, Vendor } = require("../models/Users");
const { Wallet } = require("../models/Wallet");
const { generateToken, verifyToken, verifyUserType } = require("../middlewares/auth");

// ==================== AUTH Routes ====================

// Get current user profile (protected route)
router.get("/profile", verifyToken, async (req, res) => {
    try {
        console.log("Profile request for user:", req.user.email);
        
        // Return user data without sensitive info
        const userData = {
            id: req.user.userData._id,
            name: req.user.userData.name,
            email: req.user.userData.email,
            contact: req.user.userData.contact,
            userType: req.user.userType
        };

        // Add type-specific fields
        if (req.user.userType === 'Buyer' || req.user.userType === 'buyer') {
            userData.age = req.user.userData.age;
            userData.batchNumber = req.user.userData.batchNumber;
            userData.favourites = req.user.userData.favourites || [];
        } else if (req.user.userType === 'Vendor' || req.user.userType === 'vendor') {
            userData.shopName = req.user.userData.shopName;
            userData.openTime = req.user.userData.openTime;
            userData.closeTime = req.user.userData.closeTime;
        }

        console.log("Profile data sent:", userData);
        res.json(userData);
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// Verify token endpoint
router.get("/verify", verifyToken, (req, res) => {
    res.json({ 
        valid: true, 
        user: {
            id: req.user.id,
            email: req.user.email,
            userType: req.user.userType
        }
    });
});

// Logout endpoint (client-side token removal)
router.post("/logout", (req, res) => {
    // With JWT, logout is handled client-side by removing the token
    // We could implement a token blacklist here if needed
    res.json({ message: "Logged out successfully" });
});

// ==================== GET Routes ====================

// Get all buyers
router.get("/buyers", async (req, res) => {
    try {
        const buyers = await Buyer.find();
        res.json(buyers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get all vendors
router.get("/vendors", async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.json(vendors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// ==================== FIND Routes ====================

// Find a buyer by email
router.post("/findbuyer", async (req, res) => {
    try {
        const user = await Buyer.findOne({ email: req.body.email });
        res.json(user || null);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Find a vendor by email
router.post("/findvendor", async (req, res) => {
    try {
        const user = await Vendor.findOne({ email: req.body.email });
        res.json(user || null);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// ==================== UPDATE Routes ====================

// Update buyer details (protected route)
router.post("/updatebuyer", verifyToken, verifyUserType(['Buyer']), async (req, res) => {
    try {
        const user = await Buyer.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        Object.assign(user, {
            name: req.body.name ?? user.name,
            contact: req.body.contact ?? user.contact,
            age: req.body.age ?? user.age,
            batchNumber: req.body.batchNumber ?? user.batchNumber,
            favourites: req.body.favourites ?? user.favourites
        });

        await user.save();
        
        // Return updated user data without sensitive info
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            contact: user.contact,
            age: user.age,
            batchNumber: user.batchNumber,
            favourites: user.favourites
        };
        
        res.json(userData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Update vendor details (protected route)
router.post("/updatevendor", verifyToken, verifyUserType(['Vendor']), async (req, res) => {
    try {
        const user = await Vendor.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        Object.assign(user, {
            name: req.body.name ?? user.name,
            contact: req.body.contact ?? user.contact,
            shopName: req.body.shopName ?? user.shopName,
            openTime: req.body.openTime ?? user.openTime,
            closeTime: req.body.closeTime ?? user.closeTime
        });

        await user.save();
        
        // Return updated user data without sensitive info
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            contact: user.contact,
            shopName: user.shopName,
            openTime: user.openTime,
            closeTime: user.closeTime
        };
        
        res.json(userData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// ==================== REGISTER Routes ====================

// Register new buyer and wallet
router.post("/Buyerregister", async (req, res) => {
    console.log("Buyer registration request received:", req.body);
    try {
        // Validate required fields
        const { name, email, contact, password, age, batchNumber } = req.body;
        console.log("Extracted fields:", { name, email, contact, age, batchNumber });
        
        if (!name || !email || !contact || !password || !age || !batchNumber) {
            console.log("Missing required fields");
            return res.status(400).json({ error: "All fields are required" });
        }

        console.log("Checking for existing buyer with email:", email.toLowerCase());
        const existingBuyer = await Buyer.findOne({ email: email.toLowerCase() });
        if (existingBuyer) {
            console.log("Email already registered");
            return res.status(400).json({ error: "Email already registered" });
        }

        console.log("Creating new buyer...");
        const newUser = new Buyer({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            contact: contact,
            password: password,
            age: Number(age),
            batchNumber: batchNumber,
            favourites: req.body.favourites || []
        });

        console.log("Creating new wallet...");
        const newWallet = new Wallet({
            email: email.toLowerCase().trim(),
            balance: 0
        });

        console.log("Saving wallet...");
        await newWallet.save();
        console.log("Wallet saved successfully");
        
        console.log("Saving buyer...");
        await newUser.save();
        console.log("Buyer saved successfully");

        console.log("Registration successful:", newUser);
        res.status(201).json(newUser);
    } catch (err) {
        console.error("Buyer registration error:", err);
        res.status(400).json({ error: err.message || "Registration failed" });
    }
});

// Register new vendor
router.post("/Vendorregister", async (req, res) => {
    try {
        // Validate required fields
        const { name, email, contact, password, shopName, openTime, closeTime } = req.body;
        if (!name || !email || !contact || !password || !shopName || !openTime || !closeTime) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingVendor = await Vendor.findOne({ email: email.toLowerCase() });
        if (existingVendor) return res.status(400).json({ error: "Email already registered" });

        const existingShop = await Vendor.findOne({ shopName: shopName.trim() });
        if (existingShop) return res.status(400).json({ error: "Shop name already exists" });

        const newUser = new Vendor({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            contact: contact,
            password: password,
            shopName: shopName.trim(),
            openTime: openTime,
            closeTime: closeTime
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        console.error("Vendor registration error:", err);
        res.status(400).json({ error: err.message || "Registration failed" });
    }
});

// ==================== LOGIN Routes ====================

router.post("/login", async (req, res) => {
    console.log("General login request received:", req.body);
    try {
        const { email, password } = req.body;
        console.log("Looking for user with email:", email);
        
        // First check vendors
        let user = await Vendor.findOne({ email: email.toLowerCase() });
        let userType = "Vendor";

        if (user) {
            console.log("Vendor found:", user.name);
            console.log("Password check - validating credentials");
            
            if (user.password !== password) {
                console.log("Vendor password incorrect");
                return res.status(401).json({ error: "Password incorrect" });
            }
        } else {
            // Then check buyers
            user = await Buyer.findOne({ email: email.toLowerCase() });
            userType = "Buyer";
            
            if (!user) {
                console.log("No user found with email:", email);
                return res.status(404).json({ error: "Email not found" });
            }
            
            console.log("Buyer found:", user.name);
            console.log("Password check - validating credentials");
            
            if (user.password !== password) {
                console.log("Buyer password incorrect");
                return res.status(401).json({ error: "Password incorrect" });
            }
        }

        // Generate JWT token
        const token = generateToken(user, userType);
        
        // Return response with token
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            userType: userType
        };

        console.log("Login successful for", userType);
        res.json({ 
            message: `${userType} Login successful`, 
            user: userData,
            userType: userType,
            token: token
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Buyer-only login
router.post("/Buyerlogin", async (req, res) => {
    console.log("Buyer login request received:", req.body);
    try {
        const { email, password } = req.body;
        console.log("Looking for buyer with email:", email);
        
        const user = await Buyer.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log("Buyer not found with email:", email);
            return res.status(404).json({ error: "Email not found" });
        }
        
        console.log("Buyer found:", user.name);
        console.log("Password check - validating credentials");
        
        if (user.password !== password) {
            console.log("Password incorrect");
            return res.status(401).json({ error: "Password incorrect" });
        }

        // Generate JWT token
        const token = generateToken(user, "Buyer");
        
        // Return response with token
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            userType: "Buyer"
        };

        console.log("Buyer login successful");
        res.json({ 
            message: "Login successful", 
            user: userData,
            userType: "Buyer",
            token: token
        });
    } catch (err) {
        console.error("Buyer login error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// ==================== OTHER Routes ====================

// Check if shop is open
router.post("/checkshopopen", async (req, res) => {
    try {
        const { shopName } = req.body;
        const vendor = await Vendor.findOne({ shopName });
        if (!vendor) return res.status(404).json({ error: "Shop not found" });

        const isOpen = timelib.check_if_shop_open(vendor.openTime, vendor.closeTime);
        res.json({ isOpen });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Add to favourites
router.post("/addtofav", async (req, res) => {
    try {
        const { email, id } = req.body;
        const user = await Buyer.findOne({ email });
        if (!user) return res.status(404).json({ error: "Email not found" });

        if (!user.favourites.includes(id)) {
            user.favourites.push(id);
            await user.save();
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Remove from favourites
router.post("/removefromfav", async (req, res) => {
    try {
        const { email, id } = req.body;
        const user = await Buyer.findOne({ email });
        if (!user) return res.status(404).json({ error: "Email not found" });

        user.favourites = user.favourites.filter(fav => fav !== id);
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get total vendor count
router.get("/getnumvendors", async (req, res) => {
    try {
        const count = await Vendor.countDocuments();
        res.json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;

// var express = require("express");
// var router = express.Router();

// const timelib = require("../middlewares/time");

// // Load User model
// const { Buyer } = require("../models/Users");
// const { Wallet } = require("../models/Wallet");

// const { Vendor } = require("../models/Users");

// // GET request 
// // Getting all the users
// router.get("/buyers", function (req, res) {
//     Buyer.find(function (err, users) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(users);
//         }
//     })
// });

// router.get("/vendors", function (req, res) {
//     Vendor.find(function (err, users) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(users);
//         }
//     })
// });

// router.post("/findbuyer", function (req, res) {
//     Buyer.findOne({ email: req.body.email }, function (err, user) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(user);
//         }
//     })
// });

// router.post("/findvendor", function (req, res) {
//     Vendor.findOne({ email: req.body.email }, function (err, user) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(user);
//         }
//     })
// });

// // update buyer

// router.post("/updatebuyer", async (req, res) => {
//     try {
//         const user = await Buyer.findOne({ email: req.body.email });
//         if (!user) return res.status(404).json({ error: "Email not found" });

//         Object.assign(user, {
//             name: req.body.name ?? user.name,
//             contact: req.body.contact ?? user.contact,
//             age: req.body.age ?? user.age,
//             batchNumber: req.body.batchNumber ?? user.batchNumber,
//             favourites: req.body.favourites ?? user.favourites
//         });

//         await user.save();
//         res.json(user);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Server error" });
//     }
// }); 

// router.post("/updatevendor", function (req, res) {
//     Vendor.findOne({ email: req.body.email }).then(user => {
//         if (!user) {
//             return res.status(404).json({
//                 error: "Email not found",
//             });
//         } else {
//             user.name = req.body.name;
//             user.contact = req.body.contact;
//             user.shopName = req.body.shopName;
//             user.openTime = req.body.openTime;
//             user.closeTime = req.body.closeTime;
//             user.save();
//             res.json(user);
//         }
//     });
// });
// // NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them
// // POST request 
// // Add a user to db
// router.post("/Buyerregister", (req, res) => {
//     const newUser = new Buyer({
//         name: req.body.name,
//         email: req.body.email,
//         contact: req.body.contact,
//         password: req.body.password,
//         age: req.body.age,
//         batchNumber: req.body.batchNumber,
//         favourites: req.body.favourites
//     });

//     const newWallet = new Wallet({
//         email: req.body.email,
//         balance: 0
//     });
//     newWallet.save().catch(err => console.log(err));
//     newUser.save()
//         .then(user => {
//             res.status(200).json(user);
//         })
//         .catch(err => {
//             res.status(400).send(err);
//         });
// });

// router.post("/Vendorregister", (req, res) => {
//     const newUser = new Vendor({
//         name: req.body.name,
//         email: req.body.email,
//         contact: req.body.contact,
//         password: req.body.password,
//         shopName: req.body.shopName,
//         openTime: req.body.openTime,
//         closeTime: req.body.closeTime
//     });

//     newUser.save()
//         .then(user => {
//             res.status(200).json(user);
//         })
//         .catch(err => {
//             res.status(400).send(err);
//         });
// });

// // POST request 
// // Login
// router.post("/login", (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     // Find user by email
//     Vendor.findOne({ email }).then(user => {
//         // Check if user email exists
//         if (!user) {
//             // return res.status(404).json({
//             //     error: "Email not found",
//             // });
//             Buyer.findOne({ email }).then(user2 => {
//                 if (!user2) {
//                     return res.status(404).json({
//                         error: "Email not found",
//                     });
//                 }
//                 else {
//                     if (user2.password !== password) {
//                         return res.status(401).json({
//                             error: "Password incorrect",
//                         });
//                     }
//                     res.send({ message: "Buyer Login successful", user: user2, userType: "Buyer" });
//                 }
//             });
//         }
//         else {
//             // Check if password is correct
//             if (user.password !== password) {
//                 return res.status(401).json({
//                     error: "Password incorrect",
//                 });
//             }
//             // If everything is correct, return user
//             res.send({ message: "Vendor Login successful", user: user, userType: "Vendor" });
//         }
//     });
// });

// router.post("/Buyerlogin", (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     // Find user by email
//     Buyer.findOne({ email }).then(user => {
//         // Check if user email exists
//         if (!user) {
//             return res.status(404).json({
//                 error: "Email not found",
//             });
//         }
//         else {
//             // Check if password is correct
//             if (user.password !== password) {
//                 return res.status(401).json({
//                     error: "Password incorrect",
//                 });
//             }
//             // If everything is correct, return user
//             res.send({ message: "Login successful", user: user });
//         }
//     });
// });

// router.post("/checkshopopen", (req, res) => {
//     const shopName = req.body.shopName;
//     Vendor.findOne({ shopName }).then(user => {
//         if (!user) {
//             return res.status(404).json({
//                 error: "Shop not found",
//             });
//         }
//         else {
//             const openTime = user.openTime;
//             const closeTime = user.closeTime;
//             const isOpen = timelib.check_if_shop_open(openTime, closeTime);
//             res.send(isOpen);
//         }
//     });
// });
// router.post("/addtofav", (req, res) => {
//     const email = req.body.email;
//     const id = req.body.id;
//     Buyer.findOne({ email }).then(user => {
//         if (!user) {
//             return res.status(404).json({
//                 error: "Email not found",
//             });
//         }
//         else {
//             user.favourites.push(id);
//             user.save();
//             res.send(user);
//         }
//     });
// });

// router.post("/removefromfav", (req, res) => {
//     const email = req.body.email;
//     const id = req.body.id;
//     Buyer.findOne({ email }).then(user => {
//         if (!user) {
//             return res.status(404).json({
//                 error: "Email not found",
//             });
//         }
//         else {
//             user.favourites.pull(id);
//             user.save();
//             res.send(user);
//         }
//     });
// });

// // get number of vendors
// router.get("/getnumvendors", (req, res) => {
//     Vendor.find().then(user => {
//         res.send(user.length);
//     });
// });

// module.exports = router;

