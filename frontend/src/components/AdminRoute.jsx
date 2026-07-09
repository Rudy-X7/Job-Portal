import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";

function AdminRoute({ children }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await api.get("/users/profile");

        setRole(response.data.role);
      } catch (error) {
        console.error(
          "Admin authentication error:",
          error.response?.data || error.message
        );

        setRole("unauthorized");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return <p>Checking authorization...</p>;
  }

  if (role === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;