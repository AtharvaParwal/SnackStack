const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 8000;
// Load environment variables from .env file
require('dotenv').config();
// Set up the Express app
app.use(express.json());
// Set up the Express app to serve static files from the 'public' directory
app.use(express.static('public'));


// routes
var testAPIRouter = require("./routes/testAPI");
var UserRouter = require("./routes/Users");
var WalletRouter = require("./routes/Wallet");
var FoodRouter = require("./routes/FoodItems");
var OrderRouter = require("./routes/Orders");
var StatisticsRouter = require("./routes/Statistics");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/foodDeliveryDB";
mongoose.connect(MONGO_URI, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB database connection established successfully !");
})

// setup API endpoints
app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);
app.use("/food", FoodRouter);
app.use("/wallet", WalletRouter);
app.use("/order", OrderRouter);
app.use("/statistics", StatisticsRouter);


app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});
