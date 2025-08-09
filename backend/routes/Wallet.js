var express = require("express");
var router = express.Router();

const { Wallet } = require("../models/Wallet");
const { verifyToken, verifyUserType } = require("../middlewares/auth");

// Get all balances
router.get("/allbalance", async (req, res) => {
    try {
        const users = await Wallet.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get balance for current user (protected)
router.get("/getbalance", verifyToken, verifyUserType(['Buyer']), async (req, res) => {
    try {
        const user = await Wallet.findOne({ email: req.user.email });
        if (!user) {
            // Create wallet if it doesn't exist
            const newWallet = new Wallet({
                email: req.user.email,
                balance: 0
            });
            await newWallet.save();
            return res.json({ balance: 0 });
        }
        res.json({ balance: user.balance });
    } catch (err) {
        console.error("Error fetching wallet balance:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get balance for a specific email (legacy endpoint)
router.post("/getbalance", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        const user = await Wallet.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Email not found" });
        }
        res.json(user.balance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Add balance for current user (protected)
router.post("/addbalance", verifyToken, verifyUserType(['Buyer']), async (req, res) => {
    try {
        const { amount } = req.body;
        if (amount == null || amount <= 0) {
            return res.status(400).json({ error: "Amount must be a positive number" });
        }

        let user = await Wallet.findOne({ email: req.user.email });
        if (!user) {
            // Create wallet if it doesn't exist
            user = new Wallet({
                email: req.user.email,
                balance: amount
            });
        } else {
            user.balance += amount;
        }
        
        await user.save();
        res.json({ balance: user.balance, message: "Balance added successfully" });
    } catch (err) {
        console.error("Error adding balance:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Add balance (legacy endpoint)
router.post("/addbalance-legacy", async (req, res) => {
    try {
        const { email, balance } = req.body;
        if (!email || balance == null) {
            return res.status(400).json({ error: "Email and balance are required" });
        }
        if (balance < 0) {
            return res.status(400).json({ error: "Balance to add must be positive" });
        }

        const user = await Wallet.findOne({ email });
        if (!user) return res.status(404).json({ error: "Email not found" });

        user.balance += balance;
        await user.save();
        res.json(user.balance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Subtract balance (JWT protected)
router.post("/subtractbalance", verifyToken, verifyUserType(['Buyer']), async (req, res) => {
    try {
        const { amount } = req.body; // Changed from balance to amount for clarity
        const email = req.user.email; // Get email from JWT token
        
        if (amount == null) {
            return res.status(400).json({ error: "Amount is required" });
        }
        if (amount <= 0) {
            return res.status(400).json({ error: "Amount to subtract must be positive" });
        }

        const user = await Wallet.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Wallet not found for user" });
        }
        if (user.balance < amount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        user.balance = Math.max(0, user.balance - amount); // Ensure balance doesn't go negative
        await user.save();
        res.json({ 
            message: "Balance updated successfully", 
            balance: user.balance 
        });
    } catch (err) {
        console.error("Error subtracting balance:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Check if user has sufficient balance
router.post("/checkbalance", async (req, res) => {
    try {
        const { email, amount } = req.body;
        if (!email || amount == null) {
            return res.status(400).json({ error: "Email and amount are required" });
        }

        const user = await Wallet.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Email not found" });
        }

        const hasSufficientBalance = user.balance >= amount;
        res.json({ 
            hasSufficientBalance, 
            currentBalance: user.balance,
            requiredAmount: amount 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get wallet transaction summary
router.post("/summary", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        const user = await Wallet.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Email not found" });
        }

        // This would require a transactions collection for full implementation
        // For now, just return current balance
        res.json({
            currentBalance: user.balance,
            email: user.email,
            lastUpdated: user.updatedAt || new Date()
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;



// var express = require("express");
// var router = express.Router();

// const { Wallet } = require("../models/Wallet");

// router.get("/allbalance", function (req, res) {
//     Wallet.find(function (err, users) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(users);
//         }
//     })
// });

// router.post("/getbalance", (req, res) => {
//     const email = req.body.email;
//     Wallet.findOne({ email }, function (err, user) {
//         if (!user) {
//             return res.status(404).json({
//                 error: "Email not found",
//             });
//         } else {
//             res.json(user.balance);
//         }
//     })
// });

// router.post("/addbalance", async (req, res) => {
//     try {
//         const { email, balance } = req.body;
//         const user = await Wallet.findOne({ email });
//         if (!user) return res.status(404).json({ error: "Email not found" });

//         if (balance < 0) {
//             return res.status(400).json({ error: "Balance to add must be positive" });
//         }

//         user.balance += balance;
//         await user.save();
//         res.json(user.balance);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Server error" });
//     }
// });

// router.post("/subtractbalance", (req, res) => {
//     const email = req.body.email;
//     const balance = req.body.balance;
//     Wallet.findOne({ email }, function (err, user) {
//         if (!user) {
//             return res.status(404).json({
//                 error: "Email not found",
//             });
//         } else {
//             user.balance = user.balance - balance;
//             user.save();
//             res.json(user.balance);
//         }
//     })
// });

// module.exports = router;