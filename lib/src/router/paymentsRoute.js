"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paymentController_1 = require("../controllers/paymentController");
const index_1 = require("../middlewares/index");
exports.default = (router) => {
    router.use('/payments', router);
    router.get('/wallet/:id', index_1.isOwner, index_1.verifyToken, paymentController_1.getUserWallet);
    router.post('/fund-wallet/:id', index_1.isOwner, index_1.verifyToken, paymentController_1.fundUserWallet);
    router.post('/debit-wallet/:id', index_1.isOwner, index_1.verifyToken, paymentController_1.debitUserWallet);
    router.get('/transactions/:id', index_1.isOwner, index_1.verifyToken, paymentController_1.getUserTransactions);
    router.post('/transfer', index_1.verifyToken, paymentController_1.transferFundsToUser);
    // router.post('/transfer-fund', verifyToken, isOwner, transferFundsToUser)
};
//# sourceMappingURL=paymentsRoute.js.map