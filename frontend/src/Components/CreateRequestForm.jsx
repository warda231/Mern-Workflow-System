import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import "../styles/CreateRequest.css";

function CreateRequest({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await API.post("/requests", {
        title: title.trim(),
        description: description.trim(),
      });
      
      toast.success("Request Created Successfully");
      setTitle("");
      setDescription("");
      onClose(); // Close the modal
      
      if (onSuccess) {
        onSuccess(); // Refresh the requests list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Request</h2>
          <button className="modal-close" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              placeholder="Enter request title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              placeholder="Enter detailed description of your request"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows="5"
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Creating...
                </>
              ) : (
                "Create Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRequest;