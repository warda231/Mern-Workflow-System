const mongoose= require("mongoose");

const requestSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true,
      },
  
      description: {
        type: String,
        required: true,
      },
  
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Request", requestSchema);