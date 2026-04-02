const { request } = require("express");
const Request = require("../Models/Request");

exports.createRequest=async (req,res)=>{
    try {
        const {title,description}=req.body;
        const request= await Request.create({
            title:title,
            description:description,
            createdBy:req.user.id,
        });

        res.status(201).json({
            success:true,
            data:request
        });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
};

exports.getMyRequests =async (req,res)=>{
    try {
        const request= await Request.find({
            createdBy:req.user.id,

        }).sort({createdAt:-1});

        res.json({
            success: true,
            count: requests.length,
            data: requests,
          });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
};

exports.getAllRequests= async (req,res)=>{
    try {
        const requess= await  Request.find().populate("createdBy", "email role").populate("approvedBy", "email role").
        sort({createdAt: -1});

        res.json({
            success: true,
            count: requests.length,
            data: requests,
          });

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
};

exports.approveRequest = async(req,res)=>{
    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
          }
          
          request.status="approved";
          request.approvedBy=req.user.id;

          request.save();

          res.json({
            success:true,
            message:"Request Approved",
            data:request,

          });

    } catch (error) {
        res.status(500).json({
            message:error.message
        });
    }
};


exports.rejectRequest =async (req,res)=>{
 try {
const request= await Request.findById(req.params.id);
if(!request){
    return res.status(404).json({success:false,message:"Request not found!",});
}

request.status="rejected";
request.approvedBy=req.user.id;

request.save();

res.json({success:true, message:"Request successfully cancelled",data: request,});
} catch (error) {
    res.status(500).json({
        success:false,
        message:error.message,
    });
 }
};