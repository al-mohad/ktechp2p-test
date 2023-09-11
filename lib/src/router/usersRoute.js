"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const index_2 = require("../middlewares/index");
const usersController_1 = require("./../controllers/usersController");
// todo:: add token middleware
exports.default = (router) => {
    router.use('/users', router);
    // router.get('/all', getAllUsers)
    router.get('/profile', index_2.isOwner, index_2.verifyToken, usersController_1.getUserProfile);
    router.delete('/profile', index_2.isOwner, index_2.verifyToken, index_2.isUserVerified, usersController_1.deleteUser);
    router.patch('/reset-password', index_2.isOwner, index_2.verifyToken, index_2.isUserVerified, usersController_1.deleteUser);
    router.post('/upload-avatar', index_2.isOwner, index_2.verifyToken, index_2.isUserVerified, index_1.upload.single('profile'), usersController_1.updateUserAvatar);
    // router.patch('/:id', isOwner, updateUser)
};
//# sourceMappingURL=usersRoute.js.map