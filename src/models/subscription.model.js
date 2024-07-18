import mongoose,{Schema} from "mongoose";

const SubscriptionModel = new Schema({
    Subscriber:{
        type:Schema.Types.ObjectId, // one who is Subscription
        ref:"User"
    },
    chennal :{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
    },

    {
        timestamps:true, 
    }
)



export const Subscription = mongoose.model("Subscription",SubscriptionModel)