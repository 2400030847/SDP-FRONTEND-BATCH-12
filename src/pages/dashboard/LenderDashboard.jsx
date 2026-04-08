import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { getLenderLoans, getLenderPayments } from "../../services/loanService";

const LenderDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loanData = await getLenderLoans().catch(() => []);
        setLoans(loanData);
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

  const totalIssued = loans.reduce((s, l) => s + (l.principalAmount || l.amount || 0), 0);
  const activeLoans = loans.filter(l => (l.status || "").toUpperCase() === "ACTIVE");

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="page-header">
          <h2>🏦 Lender Portfolio</h2>
        </div>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-card-icon">📋</div>
            <h3>{loans.length}</h3>
            <p>Total Loans Issued</p>
          </div>
          <div className="stat-card green">
            <div className="stat-card-icon">✅</div>
            <h3>{activeLoans.length}</h3>
            <p>Active Loans</p>
          </div>
          <div className="stat-card purple">
            <div className="stat-card-icon">💰</div>
            <h3>₹{(totalIssued / 100000).toFixed(1)}L</h3>
            <p>Total Issued</p>
          </div>
          <div className="stat-card orange">
            <div className="stat-card-icon">⏳</div>
            <h3>{loans.filter(l => (l.status || "").toUpperCase() === "PENDING").length}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>📊 Portfolio Breakdown</h3>
          </div>
          <div className="chart-bar-container">
            {[
              { label: "Active", count: loans.filter(l => (l.status || "").toUpperCase() === "ACTIVE").length, color: "green" },
              { label: "Approved", count: loans.filter(l => (l.status || "").toUpperCase() === "APPROVED").length, color: "blue" },
              { label: "Pending", count: loans.filter(l => (l.status || "").toUpperCase() === "PENDING").length, color: "orange" },
              { label: "Rejected", count: loans.filter(l => (l.status || "").toUpperCase() === "REJECTED").length, color: "red" },
            ].map((item) => (
              <div key={item.label} className="chart-bar-item">
                <span className="chart-bar-label">{item.label}</span>
                <div className="chart-bar-track">
                  <div
                    className={`chart-bar-fill ${item.color}`}
                    style={{ width: `${loans.length > 0 ? (item.count / loans.length) * 100 : 0}%` }}
                  >
                    {item.count}
                  </div>
                </div>
                <span className="chart-bar-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>📋 Active Loans</h3>
          </div>
          <div className="loans-grid">
            {activeLoans.map((loan, i) => (
              <div key={i} className="loan-card">
                <div className="loan-card-header">
                  <span className="loan-card-id">{loan.id}</span>
                  <span className={`status-badge ${(loan.status || "").toLowerCase()}`}>{loan.status}</span>
                </div>
                <div className="loan-card-body">
                  <div className="loan-card-field">
                    <label>Borrower</label>
                    <span>{loan.borrowerName || loan.name || "—"}</span>
                  </div>
                  <div className="loan-card-field">
                    <label>Amount</label>
                    <span className="amount">₹{Number(loan.principalAmount || loan.amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="loan-card-field">
                    <label>Type</label>
                    <span>{loan.description || loan.type || "Loan"}</span>
                  </div>
                  <div className="loan-card-field">
                    <label>Interest</label>
                    <span>{loan.interestRate || loan.interest}% p.a.</span>
                  </div>
                </div>
                {(loan.termMonths || loan.totalEmis) > 0 && (
                  <div style={{ marginTop: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                      <span>Repayment Progress</span>
                      <span>{loan.paidEmis || 0}/{loan.termMonths || loan.totalEmis} EMIs</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${((loan.paidEmis || 0) / (loan.termMonths || loan.totalEmis || 1)) * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LenderDashboard;