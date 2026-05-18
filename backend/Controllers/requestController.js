const { request } = require("express");
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";
        const status = req.query.status || "";
        const startDate = req.query.startDate || "";
        const endDate = req.query.endDate || "";
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        // Build query object
        let query = {
            createdBy: req.user.id
        };

        // Add status filter
        if (status && status !== "all") {
            query.status = status;
        }

        // Add search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // Add date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        // Get total count for pagination
        const total = await Request.countDocuments(query);

        // ✅ Get filtered and paginated requests (THIS IS THE ONLY QUERY YOU NEED)
        const requests = await Request.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "name email role")
            .populate("approvedBy", "name email role");

        // Calculate pagination metadata
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        // ✅ Send back the filtered requests, not all requests
        res.json({
            success: true,
            data: requests,  // ← This is the filtered, paginated data
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null
            },
            filters: {
                status: status || "all",
                search: search || null,
                dateRange: {
                    start: startDate || null,
                    end: endDate || null
                }
            }
        });
    } catch (error) {
        console.error("Error in getMyRequests:", error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

const getAllRequests = async (req, res) => {
    try {
        const page=parseInt(req.query.page) ||1;
        const limit=parseInt(req.query.limit) || 5;
        const search=req.query.search || "";
        const status=req.query.status ||  "";

        const skip=(page-1) * limit;
        const startDate = req.query.startDate || "";
        const endDate = req.query.endDate || "";
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
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

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) {
                filter.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.createdAt.$lte = new Date(endDate);
            }
        }
        const total = await Request.countDocuments(filter);

        const requests = await Request.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name email role")
        .populate("approvedBy", "name email role");
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        res.json({
            success: true,
            data: requests,  // ← This is the filtered, paginated data
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null
            },
            filters: {
                status: status || "all",
                search: search || null,
                dateRange: {
                    start: startDate || null,
                    end: endDate || null
                }
            }
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