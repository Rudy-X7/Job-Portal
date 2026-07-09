import { NavLink, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
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
          <p className="sidebar-subtitle">Admin Console</p>

          <nav className="sidebar-nav">
            <NavLink to="/admin" end>
              Dashboard
            </NavLink>

            <NavLink to="/admin/jobs">
              Manage Jobs
            </NavLink>

            <NavLink to="/admin/skills">
              Manage Skills
            </NavLink>

            <NavLink to="/admin/applications">
              Applications
            </NavLink>
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

export default AdminLayout;