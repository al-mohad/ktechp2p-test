"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticationController_1 = require("../controllers/authenticationController");
const usersController_1 = require("../controllers/usersController");
const index_1 = require("../middlewares/index");
exports.default = (router) => {
    router.use('/auth', router);
    /**
     *  @openapi
     *  /register:
     *  get:
     *   tag:
     *      responses:
     *          200:
    */
    router.post('/register', authenticationController_1.register);
    router.post('/login', authenticationController_1.login);
    // todo:: logout (unsign user's jwt)
    router.post('/logout', index_1.verifyToken, usersController_1.logoutUser);
    router.post('/request-user-verification', authenticationController_1.requestUserVerification);
    router.post('/request-password-otp', authenticationController_1.requestChangePasswordOTP);
    router.post('/verify-user', index_1.verifyToken, authenticationController_1.verifyUser);
    router.post('/verify-password-otp', authenticationController_1.verifyPasswordOTP);
    router.post('/change-password', authenticationController_1.changePassword);
};
//# sourceMappingURL=authenticationRoute.js.map