const Request = require("../Models/Request.js");

const createRequest = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        const request = await Request.create({
            title: title,
            description: description,
            createdBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({
            createdBy: req.user.id,
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: requests.length,
            data: requests,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllRequests = async (req, res) => {
    try {
        const page=parseInt(req.query.page) ||1;
        const limit=parseInt(req.query.limit) || 5;
        const search=req.query.search || "";
        const status=req.query.status ||  "";

        const skip=(page-1) * limit;

        let filter = {};

        if (status) {
          filter.status = status;
        }

        if(search)
        {
            filter.$or=[
              {title:{$regex:search, $options:"i"}},
              { description: { $regex: search, $options: "i" } },

            ];
        }

        
        const requests = await Request.find()
            .populate("createdBy", "email role")
            .populate("approvedBy", "email role").skip(skip).limit(limit)
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: requests.length,
            data: requests,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({ 
                success: false,
                message: "Request not found" 
            });
        }
        
        request.status = "approved";
        request.approvedBy = req.user.id;
        await request.save();

        res.json({
            success: true,
            message: "Request Approved",
            data: request,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const rejectRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found!"
            });
        }

        request.status = "rejected";
        request.approvedBy = req.user.id;
        await request.save();

        res.json({
            success: true,
            message: "Request successfully rejected",
            data: request,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createRequest,
    getMyRequests,
    getAllRequests,
    approveRequest,
    rejectRequest
};