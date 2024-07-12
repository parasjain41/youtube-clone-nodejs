import { Router } from "express";
import { loginUser, logOutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middle.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/api/v1/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1,

        },
        {
            name:"coverImage",
            maxCount:3
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)    

// securd routes

router.route("/logout").post(verifyJWT,logOutUser)


export default router;