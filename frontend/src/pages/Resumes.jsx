import { useEffect, useState } from "react";
import api from "../api/axios";

function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadResumes = async () => {
    try {
      const response = await api.get("/users/resumes");

      setResumes(response.data.resumes || []);
    } catch (err) {
      console.error(
        "Resume loading error:",
        err.response?.data || err.message
      );

      setError("Could not load resumes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!selectedFile) {
      setError("Please select a PDF file.");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    const formData = new FormData();

    formData.append("file", selectedFile);

    try {
      setUploading(true);

      await api.post(
        "/users/resumes/upload",
        formData
      );

      setMessage("Resume uploaded successfully.");
      setSelectedFile(null);

      await loadResumes();
    } catch (err) {
      console.error(
        "Upload error:",
        err.response?.data || err.message
      );

      const detail = err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Resume upload failed.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSetDefault = async (resumeId) => {
    setMessage("");
    setError("");

    try {
      await api.put(
        `/users/resumes/${resumeId}/default`
      );

      setMessage("Default resume updated.");

      await loadResumes();
    } catch (err) {
      console.error(
        "Default resume error:",
        err.response?.data || err.message
      );

      setError("Could not update default resume.");
    }
  };

  const handleDelete = async (resumeId) => {
    setMessage("");
    setError("");

    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/users/resumes/${resumeId}`
      );

      setMessage("Resume deleted successfully.");

      await loadResumes();
    } catch (err) {
      console.error(
        "Delete error:",
        err.response?.data || err.message
      );

      const detail = err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Could not delete resume.");
      }
    }
  };

  if (loading) {
    return <p>Loading resumes...</p>;
  }

  return (
    <div>
      {/* Page Header */}

      <div className="page-header">
        <h1>My Resumes</h1>

        <p>
          Upload and manage resumes used for your job
          applications.
        </p>
      </div>

      {/* Upload Section */}

      <section className="page-section">
        <form
          className="resume-upload-form"
          onSubmit={handleUpload}
        >
          <h2>Upload Resume</h2>

          <div className="form-group">
            <label htmlFor="resumeFile">
              Select PDF Resume
            </label>

            <input
              id="resumeFile"
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) =>
                setSelectedFile(
                  event.target.files[0]
                )
              }
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
          >
            {uploading
              ? "Uploading..."
              : "Upload PDF"}
          </button>
        </form>
      </section>

      {/* Messages */}

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

      {/* Resume List Header */}

      <div className="page-header">
        <h2>Uploaded Resumes</h2>

        <p>
          Manage your uploaded resumes and choose your
          default resume.
        </p>
      </div>

      {/* Resume List */}

      {resumes.length === 0 ? (
        <div className="empty-state">
          No resumes uploaded yet.
        </div>
      ) : (
        <div className="resume-list">
          {resumes.map((resume) => (
            <article
              className="resume-card"
              key={resume.id}
            >
              <h3>
                {resume.original_filename}
              </h3>

              {resume.is_default ? (
                <span className="default-badge">
                  Default Resume
                </span>
              ) : (
                <p className="muted-text">
                  Not Default
                </p>
              )}

              <p className="resume-info">
                <strong>Resume ID:</strong>{" "}
                {resume.id}
              </p>

              <p className="resume-info">
                <strong>Uploaded:</strong>{" "}
                {resume.uploaded_at
                  ? new Date(
                      resume.uploaded_at
                    ).toLocaleString()
                  : "Not available"}
              </p>

              <div className="button-group">
                {!resume.is_default && (
                  <button
                    className="secondary-button"
                    onClick={() =>
                      handleSetDefault(resume.id)
                    }
                  >
                    Set as Default
                  </button>
                )}

                <button
                  className="danger-button"
                  onClick={() =>
                    handleDelete(resume.id)
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

export default Resumes;