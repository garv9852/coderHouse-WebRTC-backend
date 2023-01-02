const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    name:{
        type:String
    },
    phone:{
        type:String,
    },
    email:{
        type:String,
    },
    avatar:{
        type:String
    },
    activated:{
        type:Boolean,
        required:false,
        default:false
    },
    
},{
    timestamps:true
})

const userModel=mongoose.model("userModel",userSchema,'users');
module.exports=userModel;