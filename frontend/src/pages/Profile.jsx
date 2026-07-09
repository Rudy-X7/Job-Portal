import { useEffect, useState } from "react";
import api from "../api/axios";

function Profile() {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    phone: "",
    headline: "",
    bio: "",
    experience: "",
    location: "",
    linkedin: "",
    github: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get(
          "/users/profile"
        );

        const profile = response.data;

        setUser(profile);

        setFormData({
          phone: profile.phone || "",
          headline: profile.headline || "",
          bio: profile.bio || "",
          experience:
            profile.experience !== null
              ? profile.experience
              : "",
          location: profile.location || "",
          linkedin: profile.linkedin || "",
          github: profile.github || "",
        });
      } catch (err) {
        console.error(
          "Profile loading error:",
          err.response?.data || err.message
        );

        setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setSaving(true);

    const updateData = {
      phone: formData.phone || null,
      headline: formData.headline || null,
      bio: formData.bio || null,

      experience:
        formData.experience === ""
          ? null
          : Number(formData.experience),

      location: formData.location || null,
      linkedin: formData.linkedin || null,
      github: formData.github || null,
    };

    try {
      const response = await api.put(
        "/users/profile",
        updateData
      );

      setUser(response.data);

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Profile update error:",
        err.response?.data || err.message
      );

      const detail = err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "Could not update profile."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return (
      <p className="error-message">
        {error || "Profile not available."}
      </p>
    );
  }

  return (
    <div>
      {/* Page Header */}

      <div className="page-header">
        <h1>My Profile</h1>

        <p>
          Keep your professional information up to date
          for job applications.
        </p>
      </div>

      <div className="profile-layout">
        {/* Account Information Card */}

        <aside className="profile-card profile-details">
          <h2>Account Information</h2>

          <p>
            <strong>Name</strong>
            <br />
            {user.name}
          </p>

          <p>
            <strong>Email</strong>
            <br />
            {user.email}
          </p>

          <p>
            <strong>Role</strong>
            <br />
            <span className="status-badge status-shortlisted">
              {user.role}
            </span>
          </p>

          {user.headline && (
            <p>
              <strong>Professional Headline</strong>
              <br />
              {user.headline}
            </p>
          )}

          {user.location && (
            <p>
              <strong>Location</strong>
              <br />
              {user.location}
            </p>
          )}

          {user.experience !== null && (
            <p>
              <strong>Experience</strong>
              <br />
              {user.experience}{" "}
              {user.experience === 1
                ? "year"
                : "years"}
            </p>
          )}
        </aside>

        {/* Edit Profile Form */}

        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >
          <h2>Edit Profile</h2>

          <div className="form-group">
            <label htmlFor="headline">
              Professional Headline
            </label>

            <input
              id="headline"
              name="headline"
              type="text"
              value={formData.headline}
              onChange={handleChange}
              placeholder="Backend Developer"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Phone
            </label>

            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your phone number"
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">
              Years of Experience
            </label>

            <input
              id="experience"
              name="experience"
              type="number"
              min="0"
              value={formData.experience}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">
              Bio
            </label>

            <textarea
              id="bio"
              name="bio"
              rows="5"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell employers about yourself..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="linkedin">
              LinkedIn
            </label>

            <input
              id="linkedin"
              name="linkedin"
              type="text"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn profile URL"
            />
          </div>

          <div className="form-group">
            <label htmlFor="github">
              GitHub
            </label>

            <input
              id="github"
              name="github"
              type="text"
              value={formData.github}
              onChange={handleChange}
              placeholder="GitHub profile URL"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>
        </form>
      </div>

      {/* Feedback Messages */}

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
    </div>
  );
}

export default Profile;