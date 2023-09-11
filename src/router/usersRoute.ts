import express from "express";
import { upload } from "../index";
import { isOwner, isUserVerified, verifyToken } from "../middlewares/index";
import { deleteUser, getUserProfile, updateUserAvatar } from './../controllers/usersController';

// todo:: add token middleware
export default (router: express.Router) => {
    router.use('/users', router)
    // router.get('/all', getAllUsers)
    router.get('/profile', isOwner, verifyToken, getUserProfile)
    router.delete('/profile', isOwner, verifyToken, isUserVerified, deleteUser)
    router.patch('/reset-password', isOwner, verifyToken, isUserVerified, deleteUser)
    router.post('/upload-avatar', isOwner, verifyToken, isUserVerified, upload.single('profile'), updateUserAvatar)
    // router.patch('/:id', isOwner, updateUser)
}