import { Router } from "express";
import { 
    changerCurrentPassword,
    getCurrentUser, 
    getUserChannelProfile, 
    getWactchHistory, 
    loginUser, 
    logOutUser, refreshAccessToken, 
    registerUser,
    updateAccount,
    updateCoverImage,
    updateUserAvatar 
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middle.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
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
    registerUser) //ok

router.route("/login").post(loginUser) //ok    

// securd routes


router.route("/logout").post(verifyJWT,logOutUser) // ok

router.route("/refresh-token").post(refreshAccessToken) // ok


router.route("/change-password").post(verifyJWT,changerCurrentPassword) // ok
router.route("/current-user").get(verifyJWT,getCurrentUser) // ok
router.route("/update-account").patch(verifyJWT,updateAccount)
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/cover-imange").patch(verifyJWT,upload.single("coverImange",updateCoverImage))
router.route("/c/:username").get(verifyJWT,getUserChannelProfile) // ok
router.route("/history").get(verifyJWT,getWactchHistory) //ok 


export default router;