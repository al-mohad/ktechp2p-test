"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../middlewares/index");
const usersController_1 = require("./../controllers/usersController");
// todo:: add token middleware
exports.default = (router) => {
    router.use('/admin', router);
    router.get('/users', usersController_1.getAllUsers);
    router.get('/verify-user', usersController_1.getAllUsers);
    router.delete('/update-user', index_1.isOwner, usersController_1.deleteUser);
    router.patch('/delete-user', index_1.isOwner, usersController_1.updateUser);
};
//# sourceMappingURL=adminRoutes.js.map