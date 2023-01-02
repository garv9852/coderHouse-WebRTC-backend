const router=require('express').Router();
const AuthController=require("./controllers/auth-controler")
const ActivateController=require("./controllers/activate-controller")
const authMiddleware=require('./middleware/auth-middleware')
router.post('/api/send-otp',AuthController.sendOtp);
router.post('/api/verify-otp',AuthController.verifyOtp);
router.post('/api/activate',authMiddleware,ActivateController.activate);
router.get('/api/refresh',AuthController.refresh);
router.post('/api/logout',authMiddleware,AuthController.logout)
module.exports=router;