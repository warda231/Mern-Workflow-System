const express=require("express");
const router= express.Router();
const {loginUser} =require("../Controllers/authController.js");
router.post("/loginUser",loginUser);

module.exports=router;