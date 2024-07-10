import { asyncHandler } from "../utils/asynchandler.utils.js";
import {ApiError} from "../utils/apiError.utils.js";
import {User} from "../models/user.model.js";


const  registerUser  = asyncHandler(async(req,res) =>{
  // get user details from frontend
    // validation -not empty
    // check if user already exists
    // check for imges, check for avatar
    // upload then to cloudinary,avatar
    // create user object entry in db 
    // remove password and refresh token faild from repsonse
    // check for user creation 
    // return response 
 



 
  
})


export {registerUser}