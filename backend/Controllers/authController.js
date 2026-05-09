const Users=require("../Models/Users.js");
const bcrypt =require("bcryptjs");
const jwt=require("jsonwebtoken");

const loginUser=async (req,res,next)=>{
    try {
        const {email,password}=req.body;
        const user= await Users.findOne({email});
        if(!user) throw new Error("Invalid Credentials!");
        const isMatch = await user.matchPassword(password);
if(!isMatch) throw new Error("Pssword is incorrect!");
const token=jwt.sign(
    {
        id:user.id,
        role:user.role,

    },
    process.env.JWT_SECRET,
    {expiresIn:"1h"}

);
res.json({
    message:"Login Successfull!",
    token,
    user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
    },
});

    } catch (error) {
        next(error);

    }
};

module.exports = { loginUser };