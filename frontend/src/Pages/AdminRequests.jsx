import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import "../styles/AdminRequests.css";
function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);
  
  // Filter states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [debouncedDateRange, setDebouncedDateRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Action states
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [page, debouncedSearch, statusFilter, debouncedDateRange.start, debouncedDateRange.end, sortBy, sortOrder]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== debouncedSearch) {
        setDebouncedSearch(search);
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Debounce date range
  useEffect(() => {
    const timer = setTimeout(() => {
      if (dateRange.start !== debouncedDateRange.start || dateRange.end !== debouncedDateRange.end) {
        setDebouncedDateRange(dateRange);
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [dateRange.start, dateRange.end]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let url = `/requests/?page=${page}&limit=${limit}`;
      if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
      if (statusFilter && statusFilter !== "all") url += `&status=${statusFilter}`;
      if (debouncedDateRange.start) url += `&startDate=${debouncedDateRange.start}`;
      if (debouncedDateRange.end) url += `&endDate=${debouncedDateRange.end}`;
      if (sortBy) url += `&sortBy=${sortBy}`;
      if (sortOrder) url += `&sortOrder=${sortOrder}`;
      
      const res = await API.get(url);
      setRequests(res.data?.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalItems(res.data.pagination?.totalItems || 0);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    setActionLoading(requestId);
    try {
      await API.put(`/requests/approve/${requestId}`);
      toast.success("Request approved successfully!");
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading(requestId);
    try {
      await API.put(`/requests/reject/${requestId}`);
      toast.success("Request rejected successfully!");
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "status-approved";
      case "rejected": return "status-rejected";
      default: return "status-pending";
    }
  };

  const isTyping = search !== debouncedSearch;
  const isDateChanging = dateRange.start !== debouncedDateRange.start || dateRange.end !== debouncedDateRange.end;

  if (loading) {
    return (
      <div className="admin-requests-loading">
        <div className="spinner"></div>
        <p>Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="admin-requests-container">
      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by title, description, or requester..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {isTyping && <span className="typing-indicator">Searching...</span>}
        </div>
        
        <div className="filters-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select value={`${sortBy}-${sortOrder}`} onChange={(e) => {
            const [field, order] = e.target.value.split("-");
            setSortBy(field);
            setSortOrder(order);
            setPage(1);
          }} className="filter-select">
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Date Filters */}
      <div className="date-filters-section">
        <input type="date" value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} className="date-input" />
        <span>to</span>
        <input type="date" value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} className="date-input" />
        {(search || statusFilter !== "all" || dateRange.start || dateRange.end) && (
          <button onClick={() => {
            setSearch("");
            setDebouncedSearch("");
            setStatusFilter("all");
            setDateRange({ start: "", end: "" });
            setDebouncedDateRange({ start: "", end: "" });
            setPage(1);
          }} className="clear-filters">
            Clear Filters
          </button>
        )}
        {isDateChanging && <span className="typing-indicator">Applying...</span>}
      </div>

      {/* Results Info */}
      <div className="results-info">
        Showing {requests.length} of {totalItems} requests
      </div>

      {/* Requests Table */}
      <div className="table-container">
        {requests.length === 0 ? (
          <div className="empty-state">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="35" stroke="#e5e7eb" strokeWidth="2"/>
              <path d="M40 25V40L48 48" stroke="#9ca3af" strokeWidth="2"/>
            </svg>
            <h3>No Requests Found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>Requester</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req._id}>
                  <td>
                    <div>
                      <div className="requester-name">{req.createdBy?.name || "Unknown"}</div>
                      <div className="requester-email">{req.createdBy?.email || ""}</div>
                    </div>
                   </td>
                  <td className="title-cell">{req.title}</td>
                  <td className="description-cell">{req.description}</td>
                  <td><span className={`status-badge ${getStatusColor(req.status)}`}>{req.status}</span></td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td>
                    {req.status === "pending" && (
                      <div className="action-buttons">
                        <button onClick={() => handleApprove(req._id)} disabled={actionLoading === req._id} className="approve-btn">Approve</button>
                        <button onClick={() => handleReject(req._id)} disabled={actionLoading === req._id} className="reject-btn">Reject</button>
                      </div>
                    )}
                    {req.status !== "pending" && (
                      <span className={`status-text status-${req.status}`}>{req.status === "approved" ? "✓ Approved" : "✗ Rejected"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
}

export default AdminRequests;