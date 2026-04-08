import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import LenderDashboard from "../pages/dashboard/LenderDashboard";
import BorrowerDashboard from "../pages/dashboard/BorrowerDashboard";
import AnalystDashboard from "../pages/dashboard/AnalystDashboard";
import ApplyLoan from "../pages/loans/ApplyLoan";
import LoanHistory from "../pages/loans/LoanHistory";
import Payments from "../pages/payments/Payments";
import ProtectedRoute from "../components/common/ProtectedRoute";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/lender" element={<ProtectedRoute><LenderDashboard /></ProtectedRoute>} />
      <Route path="/borrower" element={<ProtectedRoute><BorrowerDashboard /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalystDashboard /></ProtectedRoute>} />
      <Route path="/apply-loan" element={<ProtectedRoute><ApplyLoan /></ProtectedRoute>} />
      <Route path="/loan-history" element={<ProtectedRoute><LoanHistory /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;