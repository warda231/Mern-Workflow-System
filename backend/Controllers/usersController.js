const User=require("../Models/Users.js");
const bcrypt= require("bcryptjs");
const jwt=require("jsonwebtoken");
const cloudinary= require("../config/cloudinary.js");
const { filter } = require("compression");


const registerUser=async(req,res,next)=>{
    try {
      const {name,email,password}=req.body;
      if(!name || !email || !password)
      {
          throw new Error("All the fields are required!");
      
      }
      const existingUser= await User.findOne({email});
      if(existingUser){
         throw new Error("This email is already Exists!");
  
      }
  
      const hashedPassword=await bcrypt.hash(password,10);
  
      const user= await User.create({
          name:name,
          email:email,
          password:hashedPassword
      });

      res.status(201).json({
        message:"User registered successfully!"
     });
  
  
  
  
    } catch (error) {
        res.status(500).json({
            message:error.message
         });
    }
  };

  const getUsers=async (req,res,next)=>{
    try {
        const page=parseInt(req.query.page) ||1;
        const limit=parseInt(req.query.limit) || 5;
        const search=req.query.search || "";

        const skip=(page-1) * limit;

        if(search)
        {
           filter.$or=[
            {title:{$regex:search, $options:"i"}},
            { description: { $regex: search, $options: "i" } },
         ];
        }
        const users=await User.find().skip(skip).limit(limit).select("-password");
        res.json({
            success:true,
            data:users,
           
        });

    } catch (error) {
            res.status(500).json({ message: error.message });

    }
  };

  const getUserById= async (req,res,next)=>{
    try {
        const user=await User.findById(req.params.id);
        if(!user){
            throw new Error("User does not exists!");
        }
        res.json({
            success: true,
            data: user,
          });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
  };

  const uploadProfileImage= async(req,res,next)=>{
    try {
       const result= await cloudinary.uploader.upload_stream(
          {
             folder:"profiles"
          },
          async(error,result)=>{
             if(error) return next(error);
 
             const user=await User.findByIdAndUpdate(
                req.user.id,
                {profileImage: result.secure_url},
                {new: true}
             );
             res.json({
                message:"Image Uploaded!",
                user
             });
          }
       );
 
       result.end(req.file.buffer);
    } catch (error) {
       next(error);
    }
 };

 const deleteUser=async(req,res,next)=>{
    try {
       const userExists=await User.findById(req.params.id);
       if(!userExists) res.status(404).json({message:"User does not exists!"});
       const deletedUser=await User.findByIdAndDelete(req.params.id);
       if(!deleteUser)      res.status(200).json({message:"User deleted successfully!"});
       else res.status(500).json({message:"Error Occurred!"});
    } catch (error) {
       next(error);
    }
 };
 
 module.exports={getUsers,getUserById,registerUser,deleteUser,uploadProfileImage};
 

  