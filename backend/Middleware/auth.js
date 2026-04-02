const jwt= require("jsonwebtoken");
const User=require("../Models/User.js");

exports.authMiddleware= async (req,res,next)=>{
    try {
        let token;
        if(
            req.headers.authorization && req.headers.authorization.startsWith("Bearer")
        ){
            token=req.headers.authorization.split(" ")[1];
        }
        if(!token)
        {
            return res.status(401).json({
                message: "Not authorized, no token",
              });
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        req.user= await User.findById(decode.id).select("-password");

        next();
    } catch (error) {
        res.status(401).json({
            message: "Not authorized, token failed",
          });
    }
}