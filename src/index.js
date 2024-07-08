// require('dotenv').config({path:'./env'})


import dotenv from "dotenv";
import connectDB from "./db/index.db.js";
import { app } from "./app.js";

dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`Server is runing at Port : http://localhost:${process.env.PORT}/`);
    })
})
.catch((Error)=>{
    console.log("MongoDB connaction failed !!! ",Error);
})




















// import express from "express";

// const app = express()

// ( async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("Error",error);
//             throw error
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`App  is listening  on Port
//                 ${process.env.PORT}`);
//         })

        
//     } catch (error) {
//         console.error("Error",error)
//         throw error
        
//     }
// }) ()