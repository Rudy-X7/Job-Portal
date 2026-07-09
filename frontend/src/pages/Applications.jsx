import { useEffect, useState } from "react";
import api from "../api/axios";

function Applications() {
  const [applications, setApplications] =
    useState([]);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          applicationsResponse,
          jobsResponse,
        ] = await Promise.all([
          api.get("/applications/my"),
          api.get("/jobs"),
        ]);

        setApplications(
          applicationsResponse.data
        );

        setJobs(jobsResponse.data);
      } catch (err) {
        console.error(err);

        setError(
          "Could not load applications."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getJob = (jobId) =>
    jobs.find((job) => job.id === jobId);

  if (loading) {
    return <p>Loading applications...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>My Applications</h1>

        <p>
          Track the current status of your job
          applications.
        </p>
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {applications.length === 0 ? (
        <div className="empty-state">
          You have not applied for any jobs yet.
        </div>
      ) : (
        <div className="application-list">
          {applications.map((application) => {
            const job = getJob(
              application.job_id
            );

            return (
              <article
                className="application-card"
                key={application.id}
              >
                <h2>
                  {job
                    ? job.title
                    : `Job #${application.job_id}`}
                </h2>

                {job && (
                  <div className="job-meta">
                    <span>{job.company}</span>
                    <span>{job.location}</span>
                  </div>
                )}

                <p>
                  <strong>Status: </strong>

                  <span
                    className={`status-badge status-${application.status}`}
                  >
                    {application.status}
                  </span>
                </p>

                <p className="muted-text">
                  Resume ID:{" "}
                  {application.resume_id}
                </p>

                <p className="muted-text">
                  Applied:{" "}
                  {application.applied_at
                    ? new Date(
                        application.applied_at
                      ).toLocaleString()
                    : "Not available"}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Applications;