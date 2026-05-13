import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/public/Landing";

import SignIn from "./pages/auth/SignIn";
import AdminLogin from "./pages/auth/AdminLogin";

import Admin from "./pages/admin/Admin";
import AdminManagement from "./pages/admin/AdminManagement";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSettings from "./pages/admin/AdminSettings";

import User from "./pages/user/User";
import UserAccount from "./pages/user/UserAccount";
import UserPayments from "./pages/user/UserPayments";
import UserPackages from "./pages/user/UserPackages";
import UserSupport from "./pages/user/UserSupport";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import UserDashboardLayout from "@/components/layout/UserDashboardLayout";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/private" element={<AdminLogin />} />

      {/* Admin dashboard shell */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]} redirectTo="/">
            <AdminDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Admin />} />
        <Route path="manage" element={<AdminManagement />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* User dashboard shell */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={["super_admin", "client"]} redirectTo="/">
            <UserDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<User />} />
        <Route path="account" element={<UserAccount />} />
        <Route path="payments" element={<UserPayments />} />
        <Route path="packages" element={<UserPackages />} />
        <Route path="support" element={<UserSupport />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}