import express from "express";
import { deleteUser, getAllUsers, updateUser } from "../controllers/usersController";
import { isOwner } from "../middlewares/index";

export default (router: express.Router) => {
    router.use('/super-admin', router)
    router.get('/users', getAllUsers)
    router.get('/verify-user', getAllUsers)
    router.delete('/update-user', isOwner, deleteUser)
    router.patch('/delete-user', isOwner, updateUser)
}