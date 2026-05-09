import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "../styles/Layout.css";

function Layout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ← Add loading state
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Layout - Token exists:", !!token); // Debug log
    
    if (!token) {
      console.log("No token, redirecting to login");
      navigate("/");
      return;
    }

    const userData = localStorage.getItem("user");
    console.log("Layout - User data:", userData); // Debug log
    
    if (userData) {
      try {
        setUser(JSON.parse(userData));
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

  // Show loading state
  if (loading) {
    return (
      <div className="layout-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="layout-sidebar">
        <div className="sidebar-logo">
          {/* ✅ Fixed SVG with properly defined gradient */}
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sidebarGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1"/>
                <stop offset="1" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
            <rect width="48" height="48" rx="12" fill="url(#sidebarGradient)" />
            <path d="M24 14L30 20L24 26L18 20L24 14Z" fill="white" stroke="white" strokeWidth="2"/>
            <path d="M24 26V34" stroke="white" strokeWidth="2"/>
            <path d="M18 32H30" stroke="white" strokeWidth="2"/>
          </svg>
          <span>Workflow<span>System</span></span>
        </div>

        <nav className="sidebar-nav">
          <a href="/dashboard" className={`nav-item ${isActive("/dashboard")}`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2.5 7.5L10 2.5L17.5 7.5L10 12.5L2.5 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M5 10L5 15.5L15 15.5L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Dashboard
          </a>
          <a href="/requests" className={`nav-item ${isActive("/requests")}`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2.5" y="2.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6.25 10H13.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6.25 6.25H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            My Requests
          </a>
          <a href="/new-request" className={`nav-item ${isActive("/new-request")}`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4.375V15.625M4.375 10H15.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            New Request
          </a>
          {user?.role === "admin" && (
            <a href="/admin" className={`nav-item ${isActive("/admin")}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 12.5C12.0711 12.5 13.75 10.8211 13.75 8.75C13.75 6.67893 12.0711 5 10 5C7.92893 5 6.25 6.67893 6.25 8.75C6.25 10.8211 7.92893 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M15.5 17.5C15.5 15.5 13.5 13.5 10 13.5C6.5 13.5 4.5 15.5 4.5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Admin Panel
            </a>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name || "User"}</p>
              <p className="user-role">{user?.role || "Employee"}</p>
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
      <div className="layout-main">
        {/* Top Header */}
        <header className="layout-header">
          <div className="header-welcome">
            <h1>Welcome back, {user?.name || "User"}!</h1>
            <p>Here's your workflow overview</p>
          </div>
          <div className="header-actions">
            <div className="notification-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </header>

        {/* Dynamic Content - This is where child routes render */}
        <div className="layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;