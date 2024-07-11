import { asyncHandler } from "../utils/asynchandler.utils.js";
import {ApiError} from "../utils/apiError.utils.js";
import {User} from "../models/user.model.js";
import { uploaderOnCloudinary } from "../utils/cloudinary.ultils.js";
import { ApiResponse } from "../utils/apiRespose.utils.js";


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

    const {fullName,email,username,password} = req.body
    if (
      [fullName,email,password,username].some((field) => field?.trime()==="")
    ) {
      throw new ApiError(400,"All field are requred")
      
    }
    const existsUser = User.findOne({
      $or:[{ username },{ email }]
    })

    if (existsUser) {
      throw new ApiError(409,"User With  Email or USer  alredy exists")
      
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400,"Avatar FIle is requred")
    }
    const  avatar = await uploaderOnCloudinary(avatarLocalPath)
    const  coverImage = await uploaderOnCloudinary(coverImageLocalPath)

    if (!avatar) {
      throw new ApiError(400,"Avatar FIle is requred")    
    }
    const user = await User.create({
      fullName,
      avatar:avatar.url,
      coverImage:coverImage?.url || "",
      email,
      password,
      username :username.ToLowerCase(),
    })

    const createdUser = await user.findById(user._id).select(
      "-password  -refreshToken"
    )
    console.log(user);
    if (!createdUser) {
      throw new ApiError(500,"something  went wrong registering the user ")

      
    }
    return res.status(201).json(
      new ApiResponse(200,createdUser,"User Registered SucessFully")
    )
 
  
})


export {registerUser}