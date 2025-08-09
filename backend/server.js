const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config(); // Load env variables early

// Config
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/foodDeliveryDB";

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'https://snack-stack-y5mj.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ 
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log("Request body:", req.body);
    }
    next();
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// Routes
app.use("/user", require("./routes/Users"));
app.use("/food", require("./routes/FoodItems"));
app.use("/cart", require("./routes/Cart"));
app.use("/wallet", require("./routes/Wallet"));
app.use("/order", require("./routes/Orders"));
app.use("/statistics", require("./routes/Statistics"));

// Health check endpoint
app.get("/", (req, res) => {
    res.send({ 
        status: "Server is running",
        allowedOrigins: [
            'http://localhost:3000',
            'https://snack-stack-y5mj.vercel.app',
            process.env.FRONTEND_URL
        ].filter(Boolean),
        frontendUrl: process.env.FRONTEND_URL
    });
});

// CORS test endpoint
app.get("/cors-test", (req, res) => {
    res.json({ 
        message: "CORS is working!", 
        origin: req.headers.origin,
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const PORT = 8000;
// // Load environment variables from .env file
// require('dotenv').config();
// // Set up the Express app
// app.use(express.json());
// // Set up the Express app to serve static files from the 'public' directory
// app.use(express.static('public'));


// // routes
// var testAPIRouter = require("./routes/testAPI");
// var UserRouter = require("./routes/Users");
// var WalletRouter = require("./routes/Wallet");
// var FoodRouter = require("./routes/FoodItems");
// var OrderRouter = require("./routes/Orders");
// var StatisticsRouter = require("./routes/Statistics");

// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Connection to MongoDB
// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/foodDeliveryDB";
// mongoose.connect(MONGO_URI, { useNewUrlParser: true });
// const connection = mongoose.connection;
// connection.once('open', function () {
//     console.log("MongoDB database connection established successfully !");
// })

// // setup API endpoints
// app.use("/testAPI", testAPIRouter);
// app.use("/user", UserRouter);
// app.use("/food", FoodRouter);
// app.use("/wallet", WalletRouter);
// app.use("/order", OrderRouter);
// app.use("/statistics", StatisticsRouter);


// app.listen(PORT, function () {
//     console.log("Server is running on Port: " + PORT);
// });
