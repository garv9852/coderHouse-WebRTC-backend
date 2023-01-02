const otpService=require("../services/otp-service");
const hashService=require("../services/hash-service")
const UserService=require("../services/user-service");
const tokenService=require("../services/token-service");
const UserDto=require("../dtos/user-dto");
const userService = require("../services/user-service");
class AuthController{
    async sendOtp(req,res){
        const {phone}=req.body;
        if(!phone)
        {
            res.status(400).json({
                message:""
            })
        }
        const otp=await otpService.generateOtp();

        const ttl=1000*60*2;
        const expires=Date.now()+ttl;
        const data=`${phone}.${otp}.${expires}`
        const hash=hashService.hashOtp(data);
        
        try{
            // await otpService.sendBySms(phone,otp);
            return res.json({
                hash:`${hash}.${expires}`,
                phone,
                otp
            })   
        } 
        catch(e){
            res.status(500).json({
                message:"message sending Failed"
            })
        }
        res.json({
            hash:hash
        })
    }
    async verifyOtp(req,res){
        const {otp,hash,phone}=req.body;
        if(!otp || !hash || !phone)
        {
            return res.status(400).json({
                message:'All fields are required'
            })
        } 
        const [hashedOtp,expires]=hash.split('.');
        if(Date.now()>+expires)
        {
            res.status(400).json({message:"OTP expired"})
        }       
        const data=`${phone}.${otp}.${expires}`;
        const isVaild=otpService.verifyOtp(hashedOtp,data);
        if(!isVaild)
        {
            return res.status(400).json({
                message:"Invaild OTP"
            })
        }
        let user;
        try{
            user=await UserService.findUser({phone});
            if(!user)
            {
                user=await UserService.createUser({phone});
            }
        }
        catch(e){
            console.log(e);
            return res.status(500).json({
                message:'DB error'
            })
        }
        const {accessToken,refreshToken}=tokenService.generateTokens({id:user._id,activated:false});
        
        await tokenService.storeRefreshToken(refreshToken,user);
        res.cookie('refreshToken',refreshToken,{
            maxAge:1000*60*60*24*30,
            httpOnly:true
        })

        res.cookie('accessToken',accessToken,{
            maxAge:1000*60*60,
            httpOnly:true
        })
        const UserDo=new UserDto(user);
        res.json({user:UserDo,auth:true});
    }
    async refresh(req,res){
        const {refreshToken:refreshTokenFromCoookie}=req.cookies;
        let user;
        let dbUser;
        let dbRefreshToken
        try{
            user=await tokenService.verifyRefreshToken(refreshTokenFromCoookie);
        }
        catch(err)
        {
            return res.status(401).json({
                message:"Refresh Error Occured"
            })
        }
        try{
            dbUser=await userService.findUser({_id:user.id});
            dbRefreshToken=await tokenService.findRefreshToken(user.id,refreshTokenFromCoookie);
            if(!dbUser)
            {
                return res.status(404).json({
                    message:"user not found"
                })
            }
            if(!dbRefreshToken)
            {
                return res.status(401).json({
                    message:"token not found"
                })
            }
        }
        catch(err){
            return res.status(500).json({
                message:"Internal Error Occured",
                err:err.message
            })
        }
        const {accessToken,refreshToken}=tokenService.generateTokens({id:user.id,activated:dbUser.activated});
        dbRefreshToken.token=refreshToken;
        dbRefreshToken.save();
        res.cookie('refreshToken',refreshToken,{
            maxAge:1000*60*60*24*30,
            httpOnly:true
        })

        res.cookie('accessToken',accessToken,{
            maxAge:1000*60*60,
            httpOnly:true
        })
        return res.json({
            user:new UserDto(dbUser),
            auth:true
        })
    }
    async logout(req,res){
        const {refreshToken}=req.cookies;
        await tokenService.removeToken(refreshToken);
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken')
        res.json({user:null});
    }
}
module.exports=new AuthController();