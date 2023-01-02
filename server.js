require('dotenv').config();
const express=require("express");
const app=express();
const DbConnect=require("./database");
const router=require("./routes");
const cors=require("cors");
const cookieParser=require('cookie-parser');
app.use(express.json())
app.use(cookieParser());
const corsOption={
    credentials:true,
    origin:['http://localhost:3000']
}
app.use(cors(corsOption));
DbConnect();
app.use(router);
app.use('/storage',express.static('storage'));
app.get("/",(req,res)=>{
    res.send("hello from express")
})

const port=process.env.port || 5500
app.listen(port,()=>{
    console.log("server created",port);
})