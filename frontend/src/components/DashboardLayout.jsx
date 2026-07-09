import { NavLink, Outlet, useNavigate } from "react-router-dom";

function DashboardLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div>
          <h2 className="sidebar-logo">Job Portal</h2>
          <p className="sidebar-subtitle">Candidate Portal</p>

          <nav className="sidebar-nav">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/jobs">Jobs</NavLink>
            <NavLink to="/applications">My Applications</NavLink>
            <NavLink to="/resumes">Resumes</NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </nav>
        </div>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;