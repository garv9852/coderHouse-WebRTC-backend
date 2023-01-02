const jwt=require("jsonwebtoken");
const accessTokenSecret=process.env.JWT_ACCESS_SECRET_KEY;
const refreshTokenSecret=process.env.JWT_REFRESH_SECRET_KEY;
const refreshModel=require("../models/refresh-model");

class tokenService{
    generateTokens(payload){
        const accessToken=jwt.sign(payload,accessTokenSecret,{
            expiresIn:'1m'
        })
        const refreshToken=jwt.sign(payload,refreshTokenSecret,{
            expiresIn:'1y'
        })
        return {accessToken,refreshToken}
    }

    async storeRefreshToken(token,user)
    {
        try{
            await refreshModel.create({token:token,userId:user._id});
        }
        catch(e)
        {
            console.log(e.message);
        }
    }
    async verifyAccessToken(token)
    {
        return jwt.verify(token,accessTokenSecret);
    }
    async verifyRefreshToken(token)
    {
        return jwt.verify(token,refreshTokenSecret)
    }
    async findRefreshToken(userId,refreshToken)
    {
        try{
            return refreshModel.findOne({
                userId:{_id:userId},
                token:refreshToken
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
    async removeToken(refreshToken)
    {
        return await refreshModel.deleteOne({token:refreshToken});
    }
}
module.exports=new tokenService();