import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/Dashboard.css";
import "../Components/Layout.jsx";

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests/me");
      let requestsData = res.data?.data || [];
      setRequests(requestsData);
      
      const total = requestsData.length;
      const pending = requestsData.filter(r => r.status === "pending").length;
      const approved = requestsData.filter(r => r.status === "approved").length;
      const rejected = requestsData.filter(r => r.status === "rejected").length;
      
      setStats({ total, pending, approved, rejected });
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard-content">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 7L12 12L4 7M20 7V17L12 22L4 17V7M20 7L12 2L4 7" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Requests</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card approved">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.approved}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.rejected}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="recent-requests">
        <h2>Recent Requests</h2>
        {requests.length === 0 ? (
          <div className="empty-state">
            <p>No requests yet. Create your first request!</p>
            <a href="/new-request" className="create-btn">Create Request</a>
          </div>
        ) : (
          <div className="requests-list">
            {requests.slice(0, 5).map(req => (
              <div key={req._id} className="request-item">
                <div>
                  <h4>{req.title}</h4>
                  <p>{req.description}</p>
                </div>
                <span className={`status-badge status-${req.status}`}>{req.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;