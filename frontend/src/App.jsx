import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Applications from "./pages/Applications";
import Resumes from "./pages/Resumes";
import Profile from "./pages/Profile";

import AdminDashboard from "./admin/AdminDashboard";
import ManageJobs from "./admin/ManageJobs";
import ManageSkills from "./admin/ManageSkills";
import ManageApplications from "./admin/ManageApplications";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import DashboardLayout from "./components/DashboardLayout";
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <Navigate to="/login" replace />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Candidate Routes */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/jobs"
            element={<Jobs />}
          />

          <Route
            path="/applications"
            element={<Applications />}
          />

          <Route
            path="/resumes"
            element={<Resumes />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />
        </Route>

        {/* Admin Routes */}

        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/jobs"
            element={<ManageJobs />}
          />

          <Route
            path="/admin/skills"
            element={<ManageSkills />}
          />

          <Route
            path="/admin/applications"
            element={<ManageApplications />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;