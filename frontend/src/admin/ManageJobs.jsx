import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = {
  title: "",
  company: "",
  location: "",
  description: "",
  requirements: "",
  employment_type: "",
};

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const loadJobs = async () => {
    try {
      const response = await api.get(
        "/jobs/"
      );

      setJobs(response.data);
    } catch (err) {
      console.error(
        "Jobs loading error:",
        err.response?.data || err.message
      );

      setError("Could not load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setSaving(true);

    try {
      if (editingId) {
        await api.put(
          `/jobs/${editingId}`,
          formData
        );

        setMessage(
          "Job updated successfully."
        );
      } else {
        await api.post(
          "/jobs/",
          formData
        );

        setMessage(
          "Job created successfully."
        );
      }

      resetForm();
      await loadJobs();
    } catch (err) {
      console.error(
        "Job save error:",
        err.response?.data || err.message
      );

      const detail =
        err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Could not save job.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job) => {
    setEditingId(job.id);

    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      requirements: job.requirements,
      employment_type:
        job.employment_type,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await api.delete(
        `/jobs/${jobId}`
      );

      setMessage(
        "Job deleted successfully."
      );

      if (editingId === jobId) {
        resetForm();
      }

      await loadJobs();
    } catch (err) {
      console.error(
        "Job deletion error:",
        err.response?.data || err.message
      );

      const detail =
        err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "Could not delete job."
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
        <h1>Manage Jobs</h1>

        <p>
          Create, update, and manage job
          opportunities available to candidates.
        </p>
      </div>

      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >
        <h2>
          {editingId
            ? "Edit Job"
            : "Create New Job"}
        </h2>

        <div className="form-group">
          <label htmlFor="title">
            Job Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Backend Developer"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">
            Company
          </label>

          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">
            Location
          </label>

          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Bengaluru, India"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="employment_type">
            Employment Type
          </label>

          <select
            id="employment_type"
            name="employment_type"
            value={
              formData.employment_type
            }
            onChange={handleChange}
            required
          >
            <option value="">
              Select employment type
            </option>

            <option value="Full-time">
              Full-time
            </option>

            <option value="Part-time">
              Part-time
            </option>

            <option value="Internship">
              Internship
            </option>

            <option value="Contract">
              Contract
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Job Description
          </label>

          <textarea
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="requirements">
            Requirements
          </label>

          <textarea
            id="requirements"
            name="requirements"
            rows="5"
            value={formData.requirements}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-group">
          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Job"
                : "Create Job"}
          </button>

          {editingId && (
            <button
              className="secondary-button"
              type="button"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

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

      <div className="page-header">
        <h2>Existing Jobs</h2>

        <p>
          Review and manage currently available
          opportunities.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          No jobs have been created.
        </div>
      ) : (
        <div className="admin-list">
          {jobs.map((job) => (
            <article
              className="admin-card"
              key={job.id}
            >
              <h3>{job.title}</h3>

              <div className="job-meta">
                <span>
                  <strong>Company:</strong>{" "}
                  {job.company}
                </span>

                <span>
                  <strong>Location:</strong>{" "}
                  {job.location}
                </span>

                <span>
                  <strong>Type:</strong>{" "}
                  {job.employment_type}
                </span>
              </div>

              <p>
                <strong>Description:</strong>
                <br />
                {job.description}
              </p>

              <p>
                <strong>Requirements:</strong>
                <br />
                {job.requirements}
              </p>

              <div className="button-group">
                <button
                  className="secondary-button"
                  onClick={() =>
                    handleEdit(job)
                  }
                >
                  Edit
                </button>

                <button
                  className="danger-button"
                  onClick={() =>
                    handleDelete(job.id)
                  }
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageJobs;