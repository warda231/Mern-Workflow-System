const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../Middleware/auth.js");
const { roleMiddleware } = require("../Middleware/role.js");
const {body}=require("express-validator");
const  validate= require("../Middleware/Validate.js");

const {
    createRequest,
    getAllRequests,
    getMyRequests,
    approveRequest,
    rejectRequest,
}=require("../Controllers/requestController.js");

router.post("/",authMiddleware,[
    body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({min:3})
    .withMessage("Title must be atleast of 3 characters"),

    body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({min:5})
    .withMessage("Description must be at least 5 characters"),


],validate,createRequest);
router.get("/me",authMiddleware,getMyRequests);
router.get("/",authMiddleware,roleMiddleware("admin"),getAllRequests);
router.put("/approve/:id",authMiddleware,roleMiddleware("manager"),approveRequest);
router.put("/reject/:id", authMiddleware,roleMiddleware("manager"),rejectRequest);

module.exports=router;
