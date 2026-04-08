import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import useAuth from "../../hooks/useAuth";
import { getPaymentsByRole } from "../../services/loanService";

const Payments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPaymentsByRole(user?.role);
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

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

  const paidPayments = payments.filter(p => ["COMPLETED", "PAID", "LATE"].includes((p.status || "").toUpperCase()));
  const pendingPayments = payments.filter(p => ["PENDING", "UPCOMING"].includes((p.status || "").toUpperCase()));
  const totalPaid = paidPayments.reduce((s, p) => s + (p.amountPaid || p.amountDue || p.amount || 0), 0);
  const totalPending = pendingPayments.reduce((s, p) => s + (p.amountDue || p.amount || 0), 0);

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="page-header">
          <h2>💳 Payments</h2>
        </div>

        <div className="stats-grid">
          <div className="stat-card green">
            <div className="stat-card-icon">✅</div>
            <h3>{paidPayments.length}</h3>
            <p>Payments Made</p>
          </div>
          <div className="stat-card purple">
            <div className="stat-card-icon">💰</div>
            <h3>₹{(totalPaid / 100000).toFixed(1)}L</h3>
            <p>Total Paid</p>
          </div>
          <div className="stat-card orange">
            <div className="stat-card-icon">⏳</div>
            <h3>{pendingPayments.length}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card blue">
            <div className="stat-card-icon">📅</div>
            <h3>₹{(totalPending / 100000).toFixed(1)}L</h3>
            <p>Due Amount</p>
          </div>
        </div>

        {pendingPayments.length > 0 && (
          <div className="dashboard-section">
            <div className="section-header">
              <h3>⏳ Upcoming Payments</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment #</th>
                  <th>Amount Due</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.map((p, i) => (
                  <tr key={p.id || i}>
                    <td style={{ fontFamily: "'Courier New', monospace", color: "var(--primary-400)" }}>
                      #{p.paymentNumber || p.id}
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--warning)" }}>
                      ₹{(p.amountDue || p.amount || 0).toLocaleString()}
                    </td>
                    <td>{p.dueDate?.split("T")[0] || p.date || "—"}</td>
                    <td><span className="status-badge pending">{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="dashboard-section">
          <div className="section-header">
            <h3>📜 Payment History</h3>
          </div>
          {paidPayments.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment #</th>
                  <th>Amount Paid</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paidPayments.map((p, i) => (
                  <tr key={p.id || i}>
                    <td style={{ fontFamily: "'Courier New', monospace", color: "var(--primary-400)" }}>
                      #{p.paymentNumber || p.id}
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--success)" }}>
                      ₹{(p.amountPaid || p.amountDue || p.amount || 0).toLocaleString()}
                    </td>
                    <td>{p.paidDate?.split("T")[0] || p.dueDate?.split("T")[0] || "—"}</td>
                    <td>{p.paymentMethod || "—"}</td>
                    <td>
                      <span className={`status-badge ${(p.status || "").toLowerCase()}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">💳</div>
              <h3>No completed payments</h3>
              <p>Payment history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Payments;
