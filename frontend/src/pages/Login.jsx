import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      // FastAPI OAuth2PasswordRequestForm expects
      // username and password as form-encoded data.
      const loginData = new URLSearchParams();

      loginData.append("username", formData.email);
      loginData.append("password", formData.password);

      // Step 1: Login and receive JWT.
      const response = await api.post(
        "/auth/login",
        loginData,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

      const token = response.data.access_token;

      if (!token) {
        setError(
          "Login succeeded but no access token was returned."
        );
        return;
      }

      // Step 2: Store JWT.
      localStorage.setItem("token", token);

      // Step 3: Get the logged-in user's role.
      const profileResponse = await api.get(
        "/users/profile"
      );

      const role = profileResponse.data.role;

      // Step 4: Redirect based on role.
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "candidate") {
        navigate("/dashboard");
      } else {
        localStorage.removeItem("token");

        setError(
          "Your account has an unsupported role."
        );
      }
    } catch (err) {
      console.error(
        "Login error:",
        err.response?.data || err.message
      );

      // Remove any token if profile loading fails
      // after the login request.
      localStorage.removeItem("token");

      const detail = err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "Login failed. Please check your email and password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">
            Email
          </label>

          <br />

          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="password">
            Password
          </label>

          <br />

          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p>
            {error}
          </p>
        )}
      </form>

      <p>
        No account?{" "}
        <Link to="/signup">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;