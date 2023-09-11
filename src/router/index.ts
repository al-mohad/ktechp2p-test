import express from "express";
import path from "path";
import authenticationRoute from "./authenticationRoute";
import paymentsRoute from "./paymentsRoute";
import playground from "./playgroundRouter";
import superAdminRouter from "./superAdminRouter";
import usersRoute from "./usersRoute";
const router = express.Router();

// todo::  implement schema validation using Joi package
export default (): express.Router => {
    authenticationRoute(router)
    usersRoute(router)
    paymentsRoute(router)
    superAdminRouter(router)
    playground(router)
    router.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/../../index.html'));
    })
    return router
}