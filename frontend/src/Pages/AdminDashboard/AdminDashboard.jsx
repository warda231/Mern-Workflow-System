import { useEffect, useState } from "react";
import API from "../../api/axios";
import "../../styles/AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats and recent requests
      const recentRes = await API.get("/requests/?limit=100");
      
      setStats(statsRes.data);
      setRecentRequests(recentRes.data?.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-content">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 7L12 12L4 7M20 7V17L12 22L4 17V7M20 7L12 2L4 7" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.total || 0}</h3>
            <p>Total Requests</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 8V12L14 14" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.pending || 0}</h3>
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
            <h3>{stats.approved || 0}</h3>
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
            <h3>{stats.rejected || 0}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="recent-requests-section">
        <div className="section-header">
          <h2>Recent Requests</h2>
          <a href="/admin/requests" className="view-all-link">View All →</a>
        </div>
        
        {recentRequests.length === 0 ? (
          <div className="empty-recent">
            <p>No requests yet</p>
          </div>
        ) : (
          <div className="recent-requests-list">
            {recentRequests.map(req => (
              <div key={req._id} className="recent-request-item">
                <div className="request-info">
                  <h4>{req.title}</h4>
                  <p className="request-meta">
                    By {req.createdBy?.name} • {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`status-badge status-${req.status}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;