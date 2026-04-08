import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import useAuth from "../../hooks/useAuth";
import { getLoans, getMyPayments } from "../../services/loanService";

const BorrowerDashboard = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loanData, payData] = await Promise.all([
          getLoans().catch(() => []),
          getMyPayments().catch(() => []),
        ]);
        setLoans(loanData);
        setPayments(payData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="dashboard-container">
          <div style={{ textAlign: "center", padding: "60px" }}>
            <div className="loader-spinner"></div>
          </div>
        </div>
      </Layout>
    );
  }

  const totalBorrowed = loans.reduce((s, l) => s + (l.principalAmount || l.amount || 0), 0);
  const totalPaid = payments.filter(p => (p.status || "").toUpperCase() === "PAID").reduce((s, p) => s + (p.amount || 0), 0);
  const nextPayment = payments.find(p => (p.status || "").toUpperCase() === "UPCOMING" || (p.status || "").toUpperCase() === "PENDING");

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="page-header">
          <h2>👤 My Loans</h2>
        </div>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-card-icon">📋</div>
            <h3>{loans.length}</h3>
            <p>My Loans</p>
          </div>
          <div className="stat-card green">
            <div className="stat-card-icon">💰</div>
            <h3>₹{(totalBorrowed / 100000).toFixed(1)}L</h3>
            <p>Total Borrowed</p>
          </div>
          <div className="stat-card purple">
            <div className="stat-card-icon">📥</div>
            <h3>₹{(totalPaid / 100000).toFixed(1)}L</h3>
            <p>Total Repaid</p>
          </div>
          <div className="stat-card orange">
            <div className="stat-card-icon">📅</div>
            <h3>{nextPayment ? `₹${(nextPayment.amount || 0).toLocaleString()}` : "—"}</h3>
            <p>Next EMI Due</p>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>📋 My Active Loans</h3>
          </div>
          {loans.length > 0 ? (
            <div className="loans-grid">
              {loans.map((loan, i) => (
                <div key={i} className="loan-card">
                  <div className="loan-card-header">
                    <span className="loan-card-id">{loan.id}</span>
                    <span className={`status-badge ${(loan.status || "").toLowerCase()}`}>{loan.status}</span>
                  </div>
                  <div className="loan-card-body">
                    <div className="loan-card-field">
                      <label>Type</label>
                      <span>{loan.description || loan.type || "Loan"}</span>
                    </div>
                    <div className="loan-card-field">
                      <label>Amount</label>
                      <span className="amount">₹{Number(loan.principalAmount || loan.amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="loan-card-field">
                      <label>Interest</label>
                      <span>{loan.interestRate || loan.interest}% p.a.</span>
                    </div>
                    <div className="loan-card-field">
                      <label>EMI</label>
                      <span>₹{(loan.monthlyEMI || loan.emi || 0)?.toLocaleString()}/mo</span>
                    </div>
                  </div>
                  {(loan.termMonths || loan.totalEmis) > 0 && (
                    <div style={{ marginTop: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                        <span>{loan.paidEmis || 0}/{loan.termMonths || loan.totalEmis} EMIs paid</span>
                        <span>{(((loan.paidEmis || 0) / (loan.termMonths || loan.totalEmis || 1)) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${((loan.paidEmis || 0) / (loan.termMonths || loan.totalEmis || 1)) * 100}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No loans yet</h3>
              <p>Apply for your first loan to get started</p>
            </div>
          )}
        </div>

        {payments.length > 0 && (
          <div className="dashboard-section">
            <div className="section-header">
              <h3>💳 Payment History</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Loan ID</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: "'Courier New', monospace", color: "var(--primary-400)" }}>{p.id}</td>
                    <td>{p.loanId}</td>
                    <td style={{ fontWeight: 600, color: "var(--success)" }}>₹{(p.amount || 0).toLocaleString()}</td>
                    <td>{p.dueDate?.split("T")[0] || p.paidDate?.split("T")[0] || p.date || "—"}</td>
                    <td>
                      <span className={`status-badge ${(p.status || "").toLowerCase()}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BorrowerDashboard;