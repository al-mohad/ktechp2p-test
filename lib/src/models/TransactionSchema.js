"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoTransactionsByUserId = exports.createTransactionInMongdb = exports.TransactionModel = void 0;
const mongoose_1 = require("mongoose");
// transactions.js
const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    trnxType: {
        type: String,
        required: true,
        enum: ['CR', 'DR']
    },
    purpose: {
        type: String,
        enum: ['deposit', 'transfer', 'reversal', 'withdrawal'],
        required: true
    },
    amount: {
        type: mongoose.Decimal128,
        required: true,
        default: 0.00
    },
    isInflow: { type: Boolean },
    paymentMethod: { type: String, default: "flutterwave" },
    currency: {
        type: String,
        required: [true, "currency is required"],
        enum: ["NGN", "USD", "EUR", "GBP"],
    },
    status: {
        type: String,
        required: [true, "payment status is required"],
        enum: ["successful", "pending", "failed"],
    },
    walletId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet" },
    uid: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    reference: { type: String, required: true },
    balanceBefore: {
        type: mongoose.Decimal128,
        required: true,
    },
    balanceAfter: {
        type: mongoose.Decimal128,
        required: true,
    },
    summary: { type: String, required: true },
    trnxSummary: { type: String, required: true },
    // session: { type: String, required: true }
}, { timestamps: true });
exports.TransactionModel = mongoose.model('Transaction', transactionSchema);
const createTransactionInMongdb = (data) => new exports.TransactionModel(data).save().then((transaction) => {
    transaction.toObject();
});
exports.createTransactionInMongdb = createTransactionInMongdb;
const getMongoTransactionsByUserId = (id) => exports.TransactionModel.find({ uid: id });
exports.getMongoTransactionsByUserId = getMongoTransactionsByUserId;
//# sourceMappingURL=TransactionSchema.js.map