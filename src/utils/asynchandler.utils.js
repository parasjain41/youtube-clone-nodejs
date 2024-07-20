const asyncHandler = (requesthandler)=>{
    return (req,res,next) => {
        Promise.resolve(requesthandler(req,res,next)).catch((error)=>next(error))
    } 
}

export {asyncHandler}


// const asyncHandler = (fn) => async(req,res,next) => {
//     try {
//         await fn(req,res ,next)
        
//     } catch (error) {
//         // console.log("This is an Async error of asynchadler",error);
//         res.status(err.code || 500).json({
//             sucssess: false,
//             Message: err.Message,
//         })
//     }
// }