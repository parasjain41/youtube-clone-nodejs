import { asyncHandler } from "../utils/asynchandler.utils.js";

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

    // let fname = '';

    const {fullname,email,password,username} = req.body
    // const array = ["John", "Jane", "Alice", "Bob"];
    let elements = '';
    
    // Construct the string of elements
    for (let index = 0; index < fullname.length; index++) {
        elements += `${fullname[index]}${index < fullname.length - 1 ? '\n' : '\n'}`;
    }

    // Log the elements inside the template literal
    console.log(`
        "Fullname": ${elements}
        `);

    
//     for (const item of fullname) {

//         elements += `${array[index]}${index < array.length - 1 ? ', ' : ''}`;
        
        
//     }
//     console.log(`
//         "Fullname"${"\n", item}
//         `);
  
})


export {registerUser}