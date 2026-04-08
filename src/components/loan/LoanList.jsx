import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { getLoansByRole } from "../../services/loanService";

const LoanCard = ({ loan }) => (
  <div className="loan-card">
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
        <span>{loan.interestRate || loan.interest || 0}% p.a.</span>
      </div>
    </div>
    {(loan.termMonths || loan.totalEmis) > 0 && (
      <div style={{ marginTop: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
          <span>{loan.paidEmis || 0}/{loan.termMonths || loan.totalEmis} EMIs</span>
          <span>{(((loan.paidEmis || 0) / (loan.termMonths || loan.totalEmis || 1)) * 100).toFixed(1)}%</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${((loan.paidEmis || 0) / (loan.termMonths || loan.totalEmis || 1)) * 100}%` }} />
        </div>
      </div>
    )}
  </div>
);

const LoanList = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await getLoansByRole(user?.role);
        setLoans(data);
      } catch (err) {
        console.error("Failed to fetch loans:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchLoans();
  }, [user]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div className="loader-spinner"></div>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>No loans found</h3>
        <p>Loans will appear here once they are created</p>
      </div>
    );
  }

  return (
    <div className="loans-grid">
      {loans.map((loan, index) => (
        <LoanCard key={loan.id || index} loan={loan} />
      ))}
    </div>
  );
};

export default LoanList;