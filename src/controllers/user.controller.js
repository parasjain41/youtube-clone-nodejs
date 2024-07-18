import { asyncHandler } from "../utils/asynchandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { User } from "../models/user.model.js";
import { uploaderOnCloudinary } from "../utils/cloudinary.ultils.js";
import { ApiResponse } from "../utils/apiRespose.utils.js";
import jwt from "jsonwebtoken";
import { set } from "mongoose";

const generateAccessAndRefresh = async (userId) => {
   // get user details from frontend
    // validation -not empty
    // check if user already exists
    // check for imges, check for avatar
    // upload then to cloudinary,avatar
    // create user object entry in db 
    // remove password and refresh token faild from repsonse
    // check for user creation 
    // return response 
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access token and refresh token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if ([fullName, email, password, username].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  let coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploaderOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath ? await uploaderOnCloudinary(coverImageLocalPath) : null;

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong registering the user");
  }

  return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, "Incorrect password");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefresh(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: undefined }, { new: true });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken =  asyncHandler(async(req,res)=>{
  const incomeingRefreshToken=  req.cookie.refreshToken || req.body.refreshToken

  if (!incomeingRefreshToken) {
    throw new ApiError(401,"unauthorized request")
  }
  try {
    const decoded = jwt.verify(
      incomeingRefreshToken,
      process.env.ACCESS_TOKEN_SECRET
    )
    const user= await User.findById(decoded?._id)
    if (!user) {
      throw new ApiError(401,"invalid refresh Token")
    }
  
    if ( incomeingRefreshToken  !== user?.refreshToken)  {
      throw new ApiError(401, "refersh token is expriy or invaild")
      
    }
    const option = {
      httpOnly:true,
      secure:true,
    }
  
    const{accessToken,newrefreshToken}  =await generateAccessAndRefresh(user._id)
  
    return res
    .status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(
      new ApiResponse(
        200,
        {accessToken,refreshToken:newrefreshToken},
        "Access Token Refreshed")
    )
  
  } catch (error) {
    throw new ApiError(401,error?.message || "Auth token error")
    
  }
   


});

const changerCurrentPassword =asyncHandler(async(req,res)=>{
  const{oldPassword, NewPassword} =req.body
  const user = await User.findById(req.user?._id)
  const isPasswordCorrent= await user.isPasswordCorrect(oldPassword)
  if (!isPasswordCorrent) {
    throw new ApiError(400,"Invaild Old Password")
    
  }
  user.password = NewPassword
  await user.save({validateBeforeSave:false})

  return res
  .status(200)
  .json(new ApiResponse(200,{},"Password is Save "))


})
const getCurrentUser = asyncHandler(async(req,res)=>{
  return  res
  .status(200 )
  .json(200,req.user,"Current User Fatched Successfully ")
})

const  updateAccount  = asyncHandler(async(req,res)=>{
  const {fullName,email} = req.body
  if (!fullName || email) {
    throw new ApiError(400,"all feiled are required")
    
  }
  const user = await User.findByIdAndUpdate(
    user?._id,
    {$set:{
      fullName,
      email
    }},
    {new:true},

  ).select("-password")
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,user,
      "new api details update successfully "
    )
  )
})

const  updateUserAvatar =  asyncHandler(async(req,res)=>{
  const avatarLocalfile=  req.file?.path
  if (!avatarLocalfile) {
    throw  new ApiError(400,"Avatar File error")

    
  }
  const avatar = await uploaderOnCloudinary(avatarLocalfile)
  if (!avatar.url) {
    throw  new ApiError(400,"avatar file is avatar missing")
    
  }
  const user =await User.findByIdAndUpdate(
    req.user?._id,
    {$set:{
      avatar:avatar.url
    }},
    {new:true}
  ).select("-password")
  return res
  .status(200)
  .json(
    new ApiError(200, user," coverImage Is update")
  )
})


const updateCoverImage = asyncHandler(async(req,res)=>{
  const coverImagelocalpath = req.file?.path
  if (!coverImagelocalpath) {
    throw  new ApiError(400,"avatar file is coverImage missing")
  }
  const coverImage = await uploaderOnCloudinary(updateCoverImage)
  if (!coverImage.url) {
    throw  new ApiError(400,"avatar file is coverImage missing")
    
  }

  const user =await User.findByIdAndUpdate(
    req.user?._id,
    {$set:{
      coverImage: coverImage.url
    }},
    {new:true}
  ).select("-password")
  return res
  .status(200)
  .json(
    new ApiError(200, user," coverImage Is update")
  )
})
export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changerCurrentPassword,
  getCurrentUser,
  updateAccount,
  updateUserAvatar,
  updateCoverImage,
  
  
};
