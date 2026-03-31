const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../Middleware/auth.js");
const { roleMiddleware } = require("../Middleware/role.js");

const {
    createRequest,
    getAllRequests,
    getMyRequests,
    approveRequest,
    rejectRequest,
}=require("../Controllers/requestController.js");

router.post("/",authMiddleware,createRequest);
router.get("/me",authMiddleware,getMyRequests);
router.get("/",authMiddleware,roleMiddleware("admin"),getAllRequests);
router.put("/approve/:id",authMiddleware,roleMiddleware("manager"),approveRequest);
router.put("/reject/:id", authMiddleware,roleMiddleware("manager"),rejectRequest);

module.exports=router;
