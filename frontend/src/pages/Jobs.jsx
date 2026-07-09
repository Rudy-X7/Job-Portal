import { useEffect, useState } from "react";
import api from "../api/axios";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [selectedResumes, setSelectedResumes] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsResponse, resumesResponse] =
          await Promise.all([
            api.get("/jobs"),
            api.get("/users/resumes"),
          ]);

        setJobs(jobsResponse.data);

        const resumeList =
          resumesResponse.data.resumes || [];

        setResumes(resumeList);

        const defaultResume = resumeList.find(
          (resume) => resume.is_default
        );

        if (defaultResume) {
          const initialSelections = {};

          jobsResponse.data.forEach((job) => {
            initialSelections[job.id] =
              defaultResume.id;
          });

          setSelectedResumes(initialSelections);
        }
      } catch (err) {
        console.error(
          "Loading error:",
          err.response?.data || err.message
        );

        setError(
          "Could not load jobs or resumes."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleResumeChange = (jobId, resumeId) => {
    setSelectedResumes((previous) => ({
      ...previous,
      [jobId]: Number(resumeId),
    }));
  };

  const handleApply = async (jobId) => {
    setMessage("");
    setError("");

    const resumeId = selectedResumes[jobId];

    if (!resumeId) {
      setError(
        "Please select a resume before applying."
      );
      return;
    }

    try {
      await api.post("/applications/", {
        job_id: jobId,
        resume_id: resumeId,
      });

      setMessage(
        "Application submitted successfully."
      );
    } catch (err) {
      const detail = err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "Could not submit application."
        );
      }
    }
  };

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Available Jobs</h1>
        <p>
          Browse current opportunities and apply
          using one of your uploaded resumes.
        </p>
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

      {jobs.length === 0 ? (
        <div className="empty-state">
          No jobs are currently available.
        </div>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <article
              className="job-card"
              key={job.id}
            >
              <h2>{job.title}</h2>

              <div className="job-meta">
                <span>
                  <strong>Company:</strong>{" "}
                  {job.company}
                </span>

                <span>
                  <strong>Location:</strong>{" "}
                  {job.location}
                </span>

                {job.employment_type && (
                  <span>
                    <strong>Type:</strong>{" "}
                    {job.employment_type}
                  </span>
                )}
              </div>

              <p className="job-description">
                {job.description}
              </p>

              {job.requirements && (
                <p className="job-description">
                  <strong>Requirements:</strong>{" "}
                  {job.requirements}
                </p>
              )}

              <div className="apply-section">
                {resumes.length === 0 ? (
                  <p className="error-message">
                    Upload a resume before applying.
                  </p>
                ) : (
                  <>
                    <label>
                      Select Resume
                    </label>

                    <select
                      value={
                        selectedResumes[job.id] || ""
                      }
                      onChange={(event) =>
                        handleResumeChange(
                          job.id,
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        Choose resume
                      </option>

                      {resumes.map((resume) => (
                        <option
                          key={resume.id}
                          value={resume.id}
                        >
                          {resume.original_filename}
                          {resume.is_default
                            ? " (Default)"
                            : ""}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() =>
                        handleApply(job.id)
                      }
                    >
                      Apply for Job
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Jobs;