import express from "express";
import {
    debitUserWallet, fundUserWallet,
    getUserTransactions, getUserWallet,
    transferFundsToUser
} from "../controllers/paymentController";
import { isOwner, verifyToken } from "../middlewares/index";

export default (router: express.Router) => {
    router.use('/payments', router)
    router.get('/wallet/:id', isOwner, verifyToken, getUserWallet)
    router.post('/fund-wallet/:id', isOwner, verifyToken, fundUserWallet)
    router.post('/debit-wallet/:id', isOwner, verifyToken, debitUserWallet)
    router.get('/transactions/:id', isOwner, verifyToken, getUserTransactions)
    router.post('/transfer', verifyToken, transferFundsToUser)
    // router.post('/transfer-fund', verifyToken, isOwner, transferFundsToUser)
}