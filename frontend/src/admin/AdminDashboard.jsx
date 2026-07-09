function AdminDashboard() {
  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>

        <p>
          Manage the job portal from one place.
        </p>
      </div>

      <section className="dashboard-welcome">
        <h2>Administration Console</h2>

        <p>
          Create job opportunities, manage skills,
          and review candidate applications.
        </p>
      </section>

      <div className="card-grid">
        <div className="content-card">
          <h3>Job Management</h3>

          <p>
            Create, edit, and remove job listings.
          </p>
        </div>

        <div className="content-card">
          <h3>Skill Management</h3>

          <p>
            Maintain the skills available in the portal.
          </p>
        </div>

        <div className="content-card">
          <h3>Application Review</h3>

          <p>
            Review applications and update candidate status.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;