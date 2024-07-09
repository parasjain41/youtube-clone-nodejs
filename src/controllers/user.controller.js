import { asyncHandler } from "../utils/asynchandler.utils.js";

const  registerUser  = asyncHandler(async(req,res) =>{
    res.status(200).json({
        message:"OOH!! <h1>Hello</h1>this is User controllers"
    })
})


export {registerUser}