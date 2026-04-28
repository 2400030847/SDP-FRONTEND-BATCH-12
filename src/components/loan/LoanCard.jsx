const LoanCard = ({ loan }) => {
  return (
    <div className="loan-card">
      <div className="loan-card-header">
        <span className="loan-card-id">{loan.id}</span>
        <span className={`status-badge ${(loan.status || "").toLowerCase()}`}>
          {loan.status}
        </span>
      </div>
      <div className="loan-card-body">
        <div className="loan-card-field">
          <label>Borrower</label>
          <span>{loan.name}</span>
        </div>
        <div className="loan-card-field">
          <label>Amount</label>
          <span className="amount">₹{Number(loan.amount).toLocaleString()}</span>
        </div>
        <div className="loan-card-field">
          <label>Type</label>
          <span>{loan.type}</span>
        </div>
        <div className="loan-card-field">
          <label>Date</label>
          <span>{loan.date}</span>
        </div>
        {loan.interest && (
          <div className="loan-card-field">
            <label>Interest</label>
            <span>{loan.interest}% p.a.</span>
          </div>
        )}
        {loan.emi && (
          <div className="loan-card-field">
            <label>EMI</label>
            <span>₹{loan.emi.toLocaleString()}/mo</span>
          </div>
        )}
      </div>
      {loan.purpose && (
        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
          {loan.purpose}
        </div>
      )}
      {loan.totalEmis > 0 && (
        <div style={{ marginTop: "8px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
            color: "var(--text-muted)",
            marginBottom: "6px"
          }}>
            <span>{loan.paidEmis}/{loan.totalEmis} EMIs</span>
            <span>{((loan.paidEmis / loan.totalEmis) * 100).toFixed(0)}%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${(loan.paidEmis / loan.totalEmis) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanCard;