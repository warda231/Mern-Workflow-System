import { useEffect, useState } from "react";
import API from "../api/axios";
import CreateRequest from "../Components/CreateRequestForm.jsx";
import "../styles/Requests.css";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests/me");
      setRequests(res.data?.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCreated = () => {
    fetchRequests(); // Refresh the list
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="requests-page">
      {/* Header with Add Button */}
      <div className="requests-header">
        <h1>My Requests</h1>
        <button className="add-request-btn" onClick={() => setIsModalOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4.375V15.625M4.375 10H15.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Add Request
        </button>
      </div>

      {/* Requests Table */}
      <div className="requests-table-container">
        {requests.length === 0 ? (
          <div className="empty-requests">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="35" stroke="#e5e7eb" strokeWidth="2"/>
              <path d="M40 25V40L48 48" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No Requests Yet</h3>
            <p>Create your first request by clicking the "Add Request" button</p>
          </div>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req._id}>
                  <td className="request-title">{req.title}</td>
                  <td className="request-description-cell">{req.description}</td>
                  <td>
                    <span className={`status-badge status-${req.status}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Request Modal */}
      <CreateRequest 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRequestCreated}
      />
    </div>
  );
}

export default Requests;