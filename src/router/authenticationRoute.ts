import express from "express"
import { login, register, } from "../controllers/authenticationController"
import { logoutUser } from "../controllers/usersController"
import { verifyToken } from "../middlewares/index"

export default (router: express.Router) => {
    router.use('/auth', router)

    /**
     *  @openapi
     *  /register:
     *  get:
     *   tag:
     *      responses:
     *          200:
    */
    router.post('/register', register)
    router.post('/login', login)
    // todo:: logout (unsign user's jwt)
    router.post('/logout', verifyToken, logoutUser)
}

