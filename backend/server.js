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
    res.send({ status: "Server is running" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
