import API from './api';

// ============================================================
// ROLE-AWARE SERVICES: Each function picks the right endpoint
// based on the user's role to match backend security constraints
// ============================================================

// --- Universal loan fetcher based on role ---
export const getLoansByRole = async (role) => {
  switch ((role || '').toLowerCase()) {
    case 'admin':
      return getAllLoansAdmin();
    case 'lender':
      return getLenderLoans();
    case 'analyst':
      return getAllLoansAnalyst();
    case 'borrower':
    default:
      return getBorrowerLoans();
  }
};

// --- Universal payments fetcher based on role ---
export const getPaymentsByRole = async (role) => {
  switch ((role || '').toLowerCase()) {
    case 'admin':
      return getAdminPayments();
    case 'lender':
      return getLenderPayments();
    case 'analyst':
      return getAnalystPayments();
    case 'borrower':
    default:
      return getBorrowerPayments();
  }
};

// ============================================================
// BORROWER ENDPOINTS (/api/borrower/*)
// ============================================================
export const getLoanOffers = async () => {
  const res = await API.get('/borrower/loan-offers');
  return res.data?.data || [];
};

export const createLoan = async (loanData) => {
  const res = await API.post('/borrower/applications', loanData);
  return res.data;
};

export const getBorrowerLoans = async () => {
  const res = await API.get('/borrower/loans');
  return res.data?.data || [];
};

// Keep old name as alias
export const getLoans = getBorrowerLoans;

export const getMyApplications = async () => {
  const res = await API.get('/borrower/applications');
  return res.data?.data || [];
};

export const getBorrowerPayments = async () => {
  const res = await API.get('/borrower/payments');
  return res.data?.data || [];
};

// Keep old name as alias
export const getMyPayments = getBorrowerPayments;

export const getBorrowerDashboard = async () => {
  const res = await API.get('/borrower/dashboard');
  return res.data?.data || {};
};

// ============================================================
// LENDER ENDPOINTS (/api/lender/*)
// ============================================================
export const getLenderDashboard = async () => {
  const res = await API.get('/lender/dashboard');
  return res.data?.data || {};
};

export const getLenderLoans = async () => {
  const res = await API.get('/lender/loans');
  return res.data?.data || [];
};

export const getPendingApplications = async () => {
  const res = await API.get('/lender/applications');
  return res.data?.data || [];
};

export const approveApplication = async (id) => {
  const res = await API.post(`/lender/applications/${id}/approve`);
  return res.data;
};

export const rejectApplication = async (id, reason) => {
  const res = await API.post(`/lender/applications/${id}/reject?reason=${encodeURIComponent(reason)}`);
  return res.data;
};

export const createLoanOffer = async (data) => {
  const res = await API.post('/lender/loans', data);
  return res.data;
};

export const getLenderPayments = async () => {
  const res = await API.get('/lender/payments/pending');
  return res.data?.data || [];
};

// ============================================================
// ADMIN ENDPOINTS (/api/admin/*)
// ============================================================
export const getAdminDashboard = async () => {
  const res = await API.get('/admin/dashboard');
  return res.data?.data || {};
};

export const getAllUsers = async () => {
  const res = await API.get('/admin/users');
  return res.data?.data || [];
};

export const getUserStats = async () => {
  const res = await API.get('/admin/users/stats');
  return res.data?.data || {};
};

export const deleteUser = async (id) => {
  const res = await API.delete(`/admin/users/${id}`);
  return res.data;
};

export const toggleUserStatus = async (id) => {
  const res = await API.patch(`/admin/users/${id}/toggle-status`);
  return res.data;
};

export const getAllLoansAdmin = async () => {
  // Admin uses the analyst endpoint to get a full list of system loans for the Loan History view
  const res = await API.get('/analyst/loans');
  return res.data?.data || [];
};

export const getAdminPayments = async () => {
  // Admin uses the analyst endpoint to get a full list of system payments for the Payments view
  const res = await API.get('/analyst/payments');
  return res.data?.data || [];
};

// ============================================================
// ANALYST ENDPOINTS (/api/analyst/*)
// ============================================================
export const getLoanAnalytics = async () => {
  const res = await API.get('/analyst/reports/loans');
  return res.data?.data || {};
};

export const getRiskAssessment = async () => {
  const res = await API.get('/analyst/reports/risk');
  return res.data?.data || {};
};

export const getAllLoansAnalyst = async () => {
  const res = await API.get('/analyst/loans');
  return res.data?.data || [];
};

export const getPaymentAnalytics = async () => {
  const res = await API.get('/analyst/reports/payments');
  return res.data?.data || {};
};

export const getAnalystPayments = async () => {
  const res = await API.get('/analyst/payments');
  return res.data?.data || [];
};