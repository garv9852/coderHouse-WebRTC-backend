const mongoose=require("mongoose");
function DbConnect(){
    const DB_URL=process.env.DB_URL;
    mongoose.connect(DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(function(db){
        console.log("connected DB");
    })
    .catch((e)=>{
        console.log(e);
    })

}
module.exports=DbConnect