import express from "express";
import { performCreditWallet, performDebitWallet, validateFundWalletBody, validateGetUserWallet } from "../helpers/paymentHelpers";
import { getMongoTransactionsByUserId } from "../models/TransactionSchema";
import { getMongoUserById } from "../models/UserSchema";
import { getMongodbWalletByUsername } from "../models/WalletSchema";
const mongoose = require("mongoose");
const { v4 } = require("uuid");



export const getUserWallet = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { username } = req.body;

  let error = await validateGetUserWallet(req.body);
  if (error !== null) console.log(`Error (validateGetUserWallet): ${error}`);
  if (error !== null) return res.status(406).json({ status: 'error', message: error });

  let wallet = await getMongodbWalletByUsername(username);
  return res.status(200)
    .json({ status: 'success', message: 'User registered successfully', payload: { wallet: wallet } });

};

export const fundUserWallet = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { username, amount, purpose, summary } = req.body;

  let error = await validateFundWalletBody(req.body);
  if (error !== null) console.log(`Error (validateFundWalletBody): ${error}`);
  if (error !== null) return res.status(406).json({ status: 'error', message: error });

  const reference = v4();

  let { message, data } = await performCreditWallet(amount, username, purpose, `Ref: ${reference}`, summary, `tranxSumry: ${username} ${purpose} ${amount} on ${Date.now().toLocaleString} `)

  return res.status(201).json({ status: 'success', message: message, payload: { data } });

};

// todo:: check if wallet pin is correct
export const debitUserWallet = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { username, amount, purpose, summary } = req.body;

  let error = await validateFundWalletBody(req.body);
  if (error !== null) console.log(`Error (validateFundWalletBody): ${error}`);
  if (error !== null) return res.status(406).json({ status: 'error', message: error });

  const reference = v4();

  let { message, data } = await performDebitWallet(amount, username, purpose, `Ref: ${reference}`, summary, `tranxSumry: ${username} ${purpose} ${amount} on ${Date.now().toLocaleString} `)

  return res.status(201).json({ status: 'success', message: message, payload: { data } });

};

export const getUserTransactions = async (req: express.Request, res: express.Response) => {
  try {
    let { id } = req.params
    let user = await getMongoUserById(id)
    if (!user) return res.json({ "status": "error", "message": "user not found" })
    let wallet = await getMongodbWalletByUsername(user.username)
    if (!wallet) return res.json({ "status": "error", "message": "user wallet not found" })
    const transactions = await getMongoTransactionsByUserId(id)
    res.json({ 'statusCode': 200, "message": "transactions retrieved", payload: { transactions } })
  } catch (error) {
    console.log(`An error occured: ${error}`);
    res.json({ 'statusCode': 400, "message": "error occured", data: null })
  }
}

// todo:: check if wallet pin is correct
export const transferFundsToUser = async (req: express.Request, res: express.Response) => {
  const { toUsername, fromUsername, amount, summary, purpose } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  const reference = v4();

  try {
    const transferResult = await Promise.all([
      performDebitWallet(amount, fromUsername,
        purpose, `Ref: ${reference}`, summary,
        `tranxSumry: ${fromUsername} ${purpose} ${amount} on ${Date.now()} `),

      performCreditWallet(amount, toUsername, 'deposit', `Ref: ${reference}`, summary,
        `tranxSumry: ${toUsername} ${purpose} ${amount} on ${Date.now().toLocaleString} `)
    ])

    const failedTxns = transferResult.filter(
      (result) => result.status !== true
    );

    if (failedTxns.length) {
      const errors = failedTxns.map((a) => a.message);
      await session.abortTransaction();
      return res.status(400).json({
        status: false,
        message: errors,
      });
    }

    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({
      status: true,
      message: "Transfer successful",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      status: false,
      message: `Unable to find perform transfer. Please try again. \n Error: ${error}`,
    });
  }
}

