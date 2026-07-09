import { useEffect, useState } from "react";
import api from "../api/axios";

function ManageSkills() {
  const [skills, setSkills] =
    useState([]);

  const [skillName, setSkillName] =
    useState("");

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

  const loadSkills = async () => {
    try {
      const response = await api.get(
        "/skills/"
      );

      setSkills(response.data);
    } catch (err) {
      console.error(
        "Skills loading error:",
        err.response?.data || err.message
      );

      setError(
        "Could not load skills."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const resetForm = () => {
    setSkillName("");
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const cleanedName =
      skillName.trim();

    if (!cleanedName) {
      setError(
        "Skill name cannot be empty."
      );

      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await api.put(
          `/skills/${editingId}`,
          {
            name: cleanedName,
          }
        );

        setMessage(
          "Skill updated successfully."
        );
      } else {
        await api.post(
          "/skills/",
          {
            name: cleanedName,
          }
        );

        setMessage(
          "Skill created successfully."
        );
      }

      resetForm();
      await loadSkills();
    } catch (err) {
      console.error(
        "Skill save error:",
        err.response?.data || err.message
      );

      const detail =
        err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "Could not save skill."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setSkillName(skill.name);

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (
    skillId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await api.delete(
        `/skills/${skillId}`
      );

      setMessage(
        "Skill deleted successfully."
      );

      if (editingId === skillId) {
        resetForm();
      }

      await loadSkills();
    } catch (err) {
      console.error(
        "Skill deletion error:",
        err.response?.data || err.message
      );

      const detail =
        err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "Could not delete skill."
        );
      }
    }
  };

  if (loading) {
    return <p>Loading skills...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Manage Skills</h1>

        <p>
          Maintain the skills available within
          the job portal.
        </p>
      </div>

      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >
        <h2>
          {editingId
            ? "Edit Skill"
            : "Create New Skill"}
        </h2>

        <div className="form-group">
          <label htmlFor="skillName">
            Skill Name
          </label>

          <input
            id="skillName"
            type="text"
            value={skillName}
            onChange={(event) =>
              setSkillName(
                event.target.value
              )
            }
            placeholder="Example: Python"
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
                ? "Update Skill"
                : "Create Skill"}
          </button>

          {editingId && (
            <button
              type="button"
              className="secondary-button"
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
        <h2>Existing Skills</h2>

        <p>
          Edit or remove skills from the portal.
        </p>
      </div>

      {skills.length === 0 ? (
        <div className="empty-state">
          No skills have been created yet.
        </div>
      ) : (
        <div className="skill-grid">
          {skills.map((skill) => (
            <article
              className="skill-card"
              key={skill.id}
            >
              <h3>{skill.name}</h3>

              <p className="muted-text">
                Skill ID: {skill.id}
              </p>

              <div className="button-group">
                <button
                  className="secondary-button"
                  onClick={() =>
                    handleEdit(skill)
                  }
                >
                  Edit
                </button>

                <button
                  className="danger-button"
                  onClick={() =>
                    handleDelete(skill.id)
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

export default ManageSkills;