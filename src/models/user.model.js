import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique:true,
            lowecaese:true,
            trim:true,
            index:true,
        },
        email:{
            type: String,
            required: true,
            unique:true,
            lowecaese:true,
            trim:true,
        },
        fullName:{
            type: String,
            required: true,
            trim:true,
            index:true,
        },
        avatar:{
            type: String, // cloudinary url
            required: true,
        },
        coverImage:{
            type: String, // cloudinary url
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video",
            }
        ],
        password:{
            tpye:true,
            required:[true,"Passowrld is required"],
        },
        refreshToken:{
            type:String,
        }
    },{
        timeseries:true,
    }
)


userSchema.pre("save",async function (next){
    if (!this.isModified("password")) return next()
    this.password =  bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPassword = async function
(password){return await bcrypt.compare(password,this.password)

}

userSchema.methods.grenerateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:ACCESS_TOKEN_EXPIRY,
        }
    )
}
userSchema.methods.grenerateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:REFRESH_TOKEN_EXPIRY,
        }
    )
}


export const User = mongoose.model("User", userSchema)