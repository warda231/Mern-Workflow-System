import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import CreateRequest from "../Components/CreateRequestForm.jsx";
import "../styles/Requests.css";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);
  
  // Filter states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Separate state for debounced search
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [debouncedDateRange, setDebouncedDateRange] = useState({ start: "", end: "" }); // Debounced date range
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Track if filters are being applied
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);

  // Fetch requests when dependencies change
  useEffect(() => {
    fetchRequests();
  }, [page, debouncedSearch, statusFilter, debouncedDateRange.start, debouncedDateRange.end, sortBy, sortOrder]);

  // Debounce search - wait for user to stop typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== debouncedSearch) {
        setDebouncedSearch(search);
        setPage(1); // Reset to first page on search
      }
    }, 500); // Wait 500ms after user stops typing
    
    return () => clearTimeout(timer);
  }, [search]);

  // Debounce date range - wait for user to finish selecting dates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (dateRange.start !== debouncedDateRange.start && dateRange.end !== debouncedDateRange.end) {
        setDebouncedDateRange(dateRange);
        setPage(1); // Reset to first page on date change
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [dateRange.start, dateRange.end]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let url = `/requests/me?page=${page}&limit=${limit}`;
      if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
      if (statusFilter && statusFilter !== "all") url += `&status=${statusFilter}`;
      if (debouncedDateRange.start) url += `&startDate=${debouncedDateRange.start}`;
      if (debouncedDateRange.end) url += `&endDate=${debouncedDateRange.end}`;
      if (sortBy) url += `&sortBy=${sortBy}`;
      if (sortOrder) url += `&sortOrder=${sortOrder}`;
      
      const res = await API.get(url);
      let requestsData = res.data?.data || [];
      
      setRequests(requestsData);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalItems(res.data.pagination?.totalItems || 0);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change (does NOT trigger fetch immediately)
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handle status filter change - applies immediately
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  // Handle sort change - applies immediately
  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split("-");
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  // Handle date range change - updates local state, debounced separately
  const handleStartDateChange = (e) => {
    setDateRange(prev => ({ ...prev, start: e.target.value }));
  };

  const handleEndDateChange = (e) => {
    setDateRange(prev => ({ ...prev, end: e.target.value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setDateRange({ start: "", end: "" });
    setDebouncedDateRange({ start: "", end: "" });
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  // Pagination handlers
  const goToPrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const goToPage = (pageNum) => {
    setPage(pageNum);
  };

  const handleRequestCreated = () => {
    fetchRequests();
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Show typing indicator while debouncing
  const isTyping = search !== debouncedSearch;
  const isDateChanging = dateRange.start !== debouncedDateRange.start || dateRange.end !== debouncedDateRange.end;

  if (loading && !isApplyingFilter) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading your requests...</p>
    </div>
  );

  return (
    <div className="requests-page">
      {/* Header with Add Button */}
      <div className="requests-header">
        <div>
          <h1>My Requests</h1>
          <p className="requests-subtitle">Manage and track all your workflow requests</p>
        </div>
        <button className="add-request-btn" onClick={() => setIsModalOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4.375V15.625M4.375 10H15.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Add Request
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="filters-container">
        <div className="search-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9.375 15.625C12.786 15.625 15.625 12.786 15.625 9.375C15.625 5.96405 12.786 3.125 9.375 3.125C5.96405 3.125 3.125 5.96405 3.125 9.375C3.125 12.786 5.96405 15.625 9.375 15.625Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16.875 16.875L13.7188 13.7188" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
          {isTyping && (
            <span className="search-typing-indicator">Searching...</span>
          )}
        </div>
        
        <div className="filter-group">
          <select 
            value={statusFilter} 
            onChange={handleStatusChange}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select 
            value={`${sortBy}-${sortOrder}`}
            onChange={handleSortChange}
            className="filter-select"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="status-asc">Status (A-Z)</option>
            <option value="status-desc">Status (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="date-filters">
        <div className="date-input-group">
          <label>From:</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={handleStartDateChange}
            className="date-input"
          />
        </div>
        <div className="date-input-group">
          <label>To:</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={handleEndDateChange}
            className="date-input"
          />
        </div>
        {(search || statusFilter !== "all" || dateRange.start || dateRange.end) && (
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        )}
        {isDateChanging && (
          <span className="date-typing-indicator">Applying date filter...</span>
        )}
      </div>

      {/* Results Info */}
      <div className="results-info">
        <span>Showing {requests.length} of {totalItems} requests</span>
        {(isTyping || isDateChanging) && (
          <span className="filtering-indicator">Filtering...</span>
        )}
      </div>

      {/* Requests Table */}
      <div className="requests-table-container">
        {requests.length === 0 ? (
          <div className="empty-requests">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="35" stroke="#e5e7eb" strokeWidth="2"/>
              <path d="M40 25V40L48 48" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3>No Requests Found</h3>
            <p>Try adjusting your filters or create a new request</p>
            <button className="create-btn" onClick={() => setIsModalOpen(true)}>
              Create Request
            </button>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            onClick={goToPrevPage}
            disabled={page === 1}
            className="pagination-btn"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Previous
          </button>
          
          <div className="pagination-pages">
            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`page-number ${pageNum === page ? 'active' : ''}`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

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