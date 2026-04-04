const express = require("express");
const router = express.Router();


const { authMiddleware } = require("../Middleware/auth.js");
const { roleMiddleware } = require("../Middleware/role.js");

const {
    getUsers,getUserById,registerUser,deleteUser,uploadProfileImage
}=require("../Controllers/usersController.js");

router.post("/",registerUser);
router.get("/",authMiddleware,getUsers);
router.get("/:id",authMiddleware,roleMiddleware("admin"),getUserById);
router.delete("/:id",authMiddleware,deleteUser);
router.post("/uploadProfile/:id",authMiddleware,uploadProfileImage);

module.exports=router;
