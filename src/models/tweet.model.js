import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema({
    content:{
        type:String,
        required:true
    },
    ower:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }


}, { timestamps: true });

export const tweet = mongoose.model("tweet", tweetSchema);
