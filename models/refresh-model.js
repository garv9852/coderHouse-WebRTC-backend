const mongoose=require("mongoose");
const {Schema}=mongoose;
const refreshSchema=mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'users'
    }
})

const refreshModel=mongoose.model("refreshModel",refreshSchema,"tokens");
module.exports=refreshModel;