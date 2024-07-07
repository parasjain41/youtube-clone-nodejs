import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// console.log(`Ths is BD`${process.env.MONGODB_URI}),

 

const connectDB = async () => {
    try {
        const connectionInstance=  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n  MongoDB  Connected !!  DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED",error);
        process.exit(1)
        
    }
}

export default connectDB