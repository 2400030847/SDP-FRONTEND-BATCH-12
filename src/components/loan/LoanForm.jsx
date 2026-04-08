import { useState } from "react";
import { createLoan, getLoanOffers } from "../../services/loanService";
import useAuth from "../../hooks/useAuth";
import { LOAN_TYPES } from "../../utils/constants";
import { useEffect } from "react";

const LoanForm = () => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loanOffers, setLoanOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState("");

  const [form, setForm] = useState({
    purpose: "",
    annualIncome: "",
    employmentStatus: "",
  });

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offers = await getLoanOffers();
        setLoanOffers(offers);
      } catch (err) {
        console.error("Failed to load loan offers:", err);
      }
    };
    fetchOffers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createLoan({
        loanId: Number(selectedOffer),
        purpose: form.purpose,
        annualIncome: form.annualIncome ? Number(form.annualIncome) : null,
        employmentStatus: form.employmentStatus || null,
      });

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);

      setForm({ purpose: "", annualIncome: "", employmentStatus: "" });
      setSelectedOffer("");
    } catch (err) {
      setError(err.message || "Failed to submit application");
    }
  };

  return (
    <div>
      {submitted && (
        <div style={{
          padding: "12px 16px",
          background: "rgba(16, 185, 129, 0.12)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          borderRadius: "8px",
          color: "#34d399",
          fontSize: "14px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          ✅ Loan application submitted successfully!
        </div>
      )}

      {error && (
        <div style={{
          padding: "12px 16px",
          background: "rgba(239, 68, 68, 0.12)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          borderRadius: "8px",
          color: "#f87171",
          fontSize: "14px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}

      <form className="premium-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select a Loan Offer</label>
          {loanOffers.length > 0 ? (
            <select
              value={selectedOffer}
              onChange={(e) => setSelectedOffer(e.target.value)}
              required
            >
              <option value="">-- Choose a Loan Offer --</option>
              {loanOffers.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  ₹{(offer.principalAmount || 0).toLocaleString()} @ {offer.interestRate}% — {offer.termMonths} months
                  {offer.description ? ` (${offer.description})` : ""}
                </option>
              ))}
            </select>
          ) : (
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              No loan offers available. Check back later.
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Purpose</label>
          <textarea
            placeholder="Describe the purpose of this loan..."
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "var(--bg-input)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              fontSize: "14px",
              fontFamily: "var(--font-primary)",
              outline: "none",
              resize: "vertical",
              minHeight: "80px"
            }}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Annual Income (₹)</label>
            <input
              type="number"
              placeholder="500000"
              value={form.annualIncome}
              onChange={(e) => setForm({ ...form, annualIncome: e.target.value })}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Employment Status</label>
            <select
              value={form.employmentStatus}
              onChange={(e) => setForm({ ...form, employmentStatus: e.target.value })}
            >
              <option value="">-- Select --</option>
              <option value="EMPLOYED">Employed</option>
              <option value="SELF_EMPLOYED">Self-Employed</option>
              <option value="BUSINESS">Business Owner</option>
              <option value="STUDENT">Student</option>
              <option value="RETIRED">Retired</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={!selectedOffer}>
          📝 Submit Application
        </button>
      </form>
    </div>
  );
};

export default LoanForm;