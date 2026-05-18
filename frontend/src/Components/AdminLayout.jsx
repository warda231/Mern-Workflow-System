import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "../styles/AdminLayout.css";

function AdminLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    console.log("AdminLayout - Checking authorization");
    
    if (!token) {
      console.log("AdminLayout - No token, redirecting to login");
      navigate("/");
      return;
    }
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("AdminLayout - User role:", parsedUser.role);
        
        // ✅ Allow both admin AND manager
        if (parsedUser.role === "admin" || parsedUser.role === "manager") {
          console.log("AdminLayout - Access granted");
          setUser(parsedUser);
        } else {
          console.log("AdminLayout - Access denied, redirecting to dashboard");
          navigate("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  if (loading) {
    return (
      <div className="admin-layout-loading">
        <div className="spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="adminGradient" x1="0" y1="0" x2="48" y2="48">
                <stop stopColor="#6366f1"/>
                <stop offset="1" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
            <rect width="48" height="48" rx="12" fill="url(#adminGradient)" />
            <path d="M24 14L30 20L24 26L18 20L24 14Z" fill="white" stroke="white" strokeWidth="2"/>
            <path d="M24 26V34" stroke="white" strokeWidth="2"/>
            <path d="M18 32H30" stroke="white" strokeWidth="2"/>
          </svg>
          <span>Admin<span>Panel</span></span>
        </div>

        <nav className="admin-sidebar-nav">
          <a href="/admin/dashboard" className={`nav-item ${isActive("/admin/dashboard")}`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2.5 7.5L10 2.5L17.5 7.5L10 12.5L2.5 7.5Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 10L5 15.5L15 15.5L15 10" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 12.5V17.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Dashboard
          </a>
          <a href="/admin/requests" className={`nav-item ${isActive("/admin/requests")}`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2.5" y="2.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6.25 10H13.75" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6.25 6.25H10" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6.25 13.75H11.25" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            All Requests
          </a>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name || "Admin"}</p>
              <p className="user-role">{user?.role === "admin" ? "Administrator" : "Manager"}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M6.75 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 12.75L15.75 9L12 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M15.75 9H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-title">
            <h1>Admin Dashboard</h1>
            <p>Manage and oversee all workflow requests</p>
          </div>
          <div className="header-badge">
            <span className="admin-badge">
              {user?.role === "admin" ? "Administrator Access" : "Manager Access"}
            </span>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;