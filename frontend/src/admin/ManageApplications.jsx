import { useEffect, useState } from "react";
import api from "../api/axios";

function ManageApplications() {
  const [jobs, setJobs] =
    useState([]);

  const [
    selectedJobId,
    setSelectedJobId,
  ] = useState("");

  const [
    applications,
    setApplications,
  ] = useState([]);

  const [
    loadingJobs,
    setLoadingJobs,
  ] = useState(true);

  const [
    loadingApplications,
    setLoadingApplications,
  ] = useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await api.get(
          "/jobs/"
        );

        setJobs(response.data);
      } catch (err) {
        console.error(
          "Jobs loading error:",
          err.response?.data ||
            err.message
        );

        setError(
          "Could not load jobs."
        );
      } finally {
        setLoadingJobs(false);
      }
    };

    loadJobs();
  }, []);

  const loadApplications = async (
    jobId
  ) => {
    if (!jobId) {
      setApplications([]);
      return;
    }

    setLoadingApplications(true);
    setMessage("");
    setError("");

    try {
      const response = await api.get(
        `/applications/job/${jobId}`
      );

      setApplications(response.data);
    } catch (err) {
      console.error(
        "Applications loading error:",
        err.response?.data ||
          err.message
      );

      setError(
        "Could not load applications."
      );
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleJobChange = async (
    event
  ) => {
    const jobId =
      event.target.value;

    setSelectedJobId(jobId);

    await loadApplications(jobId);
  };

  const updateStatus = async (
    applicationId,
    newStatus
  ) => {
    setMessage("");
    setError("");

    try {
      await api.put(
        `/applications/${applicationId}/status`,
        {
          status: newStatus,
        }
      );

      setMessage(
        `Application status changed to ${newStatus}.`
      );

      await loadApplications(
        selectedJobId
      );
    } catch (err) {
      console.error(
        "Status update error:",
        err.response?.data ||
          err.message
      );

      const detail =
        err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "Could not update application status."
        );
      }
    }
  };

  if (loadingJobs) {
    return <p>Loading jobs...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Manage Applications</h1>

        <p>
          Review candidate applications and
          update their recruitment status.
        </p>
      </div>

      <div className="admin-selector">
        <label htmlFor="job">
          Select Job
        </label>

        <select
          id="job"
          value={selectedJobId}
          onChange={handleJobChange}
        >
          <option value="">
            Choose a job
          </option>

          {jobs.map((job) => (
            <option
              key={job.id}
              value={job.id}
            >
              {job.title} - {job.company}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!selectedJobId ? (
        <div className="empty-state">
          Select a job to view its applications.
        </div>
      ) : loadingApplications ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          No applications for this job.
        </div>
      ) : (
        <>
          <div className="page-header">
            <h2>Applications</h2>

            <p>
              Review each candidate application
              and update its status.
            </p>
          </div>

          <div className="application-admin-grid">
            {applications.map(
              (application) => (
                <article
                  className="admin-card"
                  key={application.id}
                >
                  <h3>
                    Application #
                    {application.id}
                  </h3>

                  <p>
                    <strong>
                      Candidate User ID:
                    </strong>{" "}
                    {application.user_id}
                  </p>

                  <p>
                    <strong>
                      Resume ID:
                    </strong>{" "}
                    {application.resume_id}
                  </p>

                  <p>
                    <strong>
                      Current Status:
                    </strong>{" "}

                    <span
                      className={
                        `status-badge status-${application.status}`
                      }
                    >
                      {application.status}
                    </span>
                  </p>

                  <p className="muted-text">
                    <strong>Applied:</strong>{" "}
                    {application.applied_at
                      ? new Date(
                          application.applied_at
                        ).toLocaleString()
                      : "Not available"}
                  </p>

                  <div className="button-group">
                    <button
                      className="success-button"
                      onClick={() =>
                        updateStatus(
                          application.id,
                          "shortlisted"
                        )
                      }
                      disabled={
                        application.status ===
                        "shortlisted"
                      }
                    >
                      Shortlist
                    </button>

                    <button
                      className="danger-button"
                      onClick={() =>
                        updateStatus(
                          application.id,
                          "rejected"
                        )
                      }
                      disabled={
                        application.status ===
                        "rejected"
                      }
                    >
                      Reject
                    </button>

                    <button
                      className="secondary-button"
                      onClick={() =>
                        updateStatus(
                          application.id,
                          "pending"
                        )
                      }
                      disabled={
                        application.status ===
                        "pending"
                      }
                    >
                      Set Pending
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ManageApplications;