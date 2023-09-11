import { Schema } from "mongoose";

// transactions.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
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
        walletId: { type: Schema.Types.ObjectId, ref: "Wallet" },
        uid: { type: Schema.Types.ObjectId, ref: "User" },
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
    },
    { timestamps: true }
);

export const TransactionModel = mongoose.model('Transaction', transactionSchema);

export const createTransactionInMongdb = (data: Record<string, any>) =>
    new TransactionModel(data).save().then((transaction: any) => {
        transaction.toObject();
    });

export const getMongoTransactionsByUserId = (id: String) => TransactionModel.find({ uid: id });

