const mongoose = require("mongoose");
const { Schema } = mongoose;

const WalletSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    balance: { type: Number, required: true, min: 0, default: 0 }
}, { timestamps: true });

const Wallet = mongoose.model("Wallet", WalletSchema);
module.exports = { Wallet };


// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;


// const WalletSchema = new Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true
//     },
//     balance: {
//         type: Number,
//         required: true,
//         min: 0
//     }
// });

// const Wallet = mongoose.model("Wallet", WalletSchema);

// module.exports = {
//     Wallet : Wallet
// };

