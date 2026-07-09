import { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get(
          "/users/profile"
        );

        setUser(response.data);
      } catch (err) {
        console.error(
          "Dashboard error:",
          err.response?.data || err.message
        );

        setError("Could not load dashboard.");
      }
    };

    loadProfile();
  }, []);

  if (error) {
    return (
      <p className="error-message">
        {error}
      </p>
    );
  }

  if (!user) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>

        <p>
          Overview of your candidate account.
        </p>
      </div>

      <section className="dashboard-welcome">
        <h2>
          Welcome, {user.name}
        </h2>

        <p>
          Manage your profile, resumes,
          applications, and job opportunities
          from your dashboard.
        </p>
      </section>

      <div className="card-grid">
        <div className="content-card">
          <h3>Account</h3>

          <p>
            <strong>Email</strong>
          </p>

          <p>{user.email}</p>
        </div>

        <div className="content-card">
          <h3>Role</h3>

          <p>
            Your account type is:
          </p>

          <p>
            <strong>{user.role}</strong>
          </p>
        </div>

        <div className="content-card">
          <h3>Professional Profile</h3>

          <p>
            {user.headline ||
              "Add a professional headline from your Profile page."}
          </p>

          <p className="muted-text">
            {user.location ||
              "Location not added"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;