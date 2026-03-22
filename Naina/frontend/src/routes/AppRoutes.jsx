import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout"; // Will create
import Login from "../pages/auth/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminForms from "../pages/admin/Forms";
import TeamLeadDashboard from "../pages/teamlead/Dashboard";
import TeamLeadInterns from "../pages/teamlead/Interns";
import TeamLeadTasks from "../pages/teamlead/Tasks";
import TeamLeadReports from "../pages/teamlead/Reports";
import TeamLeadLeaderboard from "../pages/teamlead/Leaderboard";
import InternDashboard from "../pages/intern/Dashboard";
import InternTasks from "../pages/intern/Tasks";
import InternReports from "../pages/intern/Reports";

const rolePaths = {
  admin: "/admin/dashboard",
  teamlead: "/teamlead/dashboard",
  intern: "/intern/dashboard"
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes with Layout */}
      <Route path="/admin/*" element={
        <ProtectedRoute role="admin">
          <Layout>
            <AdminRoutes />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/teamlead/*" element={
        <ProtectedRoute role="teamlead">
          <Layout>
            <TeamLeadRoutes />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/intern/*" element={
        <ProtectedRoute role="intern">
          <Layout>
            <InternRoutes />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const AdminRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="forms" element={<AdminForms />} />
    <Route index element={<Navigate to="dashboard" replace />} />
  </Routes>
);

const TeamLeadRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<TeamLeadDashboard />} />
    <Route path="interns" element={<TeamLeadInterns />} />
    <Route path="tasks" element={<TeamLeadTasks />} />
    <Route path="reports" element={<TeamLeadReports />} />
    <Route path="leaderboard" element={<TeamLeadLeaderboard />} />
    <Route index element={<Navigate to="dashboard" replace />} />
  </Routes>
);

const InternRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<InternDashboard />} />
    <Route path="tasks" element={<InternTasks />} />
    <Route path="reports" element={<InternReports />} />
    <Route index element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default AppRoutes;

