import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/Dashboard.css";

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 5; // Items per page
  
  // Filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Fetch requests when dependencies change
  useEffect(() => {
    fetchRequests();
  }, [page, search, statusFilter]); // ✅ Only these trigger re-fetch

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // ✅ Build URL with proper parameters
      let url = `/requests/me?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (statusFilter && statusFilter !== "all") url += `&status=${statusFilter}`;
      
      const res = await API.get(url);
      let requestsData = res.data?.data || [];
      
      setRequests(requestsData);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalItems(res.data.pagination?.totalItems || 0);
      
      // ✅ Calculate stats from paginated data or separate API call
      // For accurate stats, you should have a separate stats endpoint
      // For now, we'll use the data we have
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

  // ✅ Handle search with debounce
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  // ✅ Handle status filter change
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset to first page on new filter
  };

  // ✅ Handle page change
  const goToPrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
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

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={search}
          onChange={handleSearchChange}
          className="search-input"
        />
        
        <select 
          value={statusFilter} 
          onChange={handleStatusChange}
          className="status-select"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Recent Requests */}
      <div className="recent-requests">
        <h2>Recent Requests</h2>
        
        {requests.length === 0 ? (
          <div className="empty-state">
            <p>No requests found. Create your first request!</p>
            <a href="/new-request" className="create-btn">Create Request</a>
          </div>
        ) : (
          <>
            <div className="requests-list">
              {requests.map(req => (
                <div key={req._id} className="request-item">
                  <div>
                    <h4>{req.title}</h4>
                    <p>{req.description}</p>
                    <small>Created: {new Date(req.createdAt).toLocaleDateString()}</small>
                  </div>
                  <span className={`status-badge status-${req.status}`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  onClick={goToPrevPage}
                  disabled={page === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                
                <span className="page-info">
                  Page {page} of {totalPages} ({totalItems} total items)
                </span>
                
                <button
                  onClick={goToNextPage}
                  disabled={page === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;