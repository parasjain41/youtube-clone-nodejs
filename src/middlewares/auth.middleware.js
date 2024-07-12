import { ApiError } from "../utils/apiError.utils.js";
import { asyncHandler } from "../utils/asynchandler.utils.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

export const verifyJWT =   asyncHandler(async(req,_,next)=>{
    try {
        const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!verifyJWT) {
            throw new ApiError(401,"Unauthorized Request")        
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user= await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        )
        if (!user) {
            throw new ApiError(401,"Invaild Access Token")
        }
        req.user = user
        next()
    } catch (error) {
        console.log("mein  catch hu verify token se");
        throw new ApiError(401,error?.message || " invaild acess token")
    }


})