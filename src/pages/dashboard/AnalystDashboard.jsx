import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { getLoanAnalytics, getAllLoansAnalyst, getPaymentAnalytics } from "../../services/loanService";

const AnalystDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loanData, analyticsData] = await Promise.all([
          getAllLoansAnalyst().catch(() => []),
          getLoanAnalytics().catch(() => ({})),
        ]);
        setLoans(loanData);
        setAnalytics(analyticsData);
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

  const totalPortfolio = loans.reduce((s, l) => s + (l.principalAmount || l.amount || 0), 0);
  const avgInterest = loans.length > 0
    ? (loans.reduce((s, l) => s + (l.interestRate || l.interest || 0), 0) / loans.length).toFixed(1)
    : 0;
  const activeLoans = loans.filter(l => (l.status || "").toUpperCase() === "ACTIVE");
  const npaRisk = loans.filter(l => (l.status || "").toUpperCase() === "REJECTED" || (l.status || "").toUpperCase() === "DEFAULTED").length;

  // Group by description/type for analysis
  const typeAnalysis = loans.reduce((acc, l) => {
    const type = l.description || l.type || "General";
    if (!acc[type]) acc[type] = { count: 0, total: 0, active: 0 };
    acc[type].count++;
    acc[type].total += (l.principalAmount || l.amount || 0);
    if ((l.status || "").toUpperCase() === "ACTIVE") acc[type].active++;
    return acc;
  }, {});

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="page-header">
          <h2>📊 Analytics Dashboard</h2>
        </div>

        <div className="stats-grid">
          <div className="stat-card purple">
            <div className="stat-card-icon">💰</div>
            <h3>₹{(totalPortfolio / 100000).toFixed(1)}L</h3>
            <p>Portfolio Value</p>
          </div>
          <div className="stat-card blue">
            <div className="stat-card-icon">📈</div>
            <h3>{avgInterest}%</h3>
            <p>Avg Interest Rate</p>
          </div>
          <div className="stat-card green">
            <div className="stat-card-icon">✅</div>
            <h3>{activeLoans.length}</h3>
            <p>Active Loans</p>
          </div>
          <div className="stat-card red">
            <div className="stat-card-icon">⚠️</div>
            <h3>{npaRisk}</h3>
            <p>NPA / Rejected</p>
          </div>
        </div>

        {Object.keys(typeAnalysis).length > 0 && (
          <div className="analytics-grid">
            <div className="dashboard-section">
              <div className="section-header">
                <h3>📊 Loan Amount by Type</h3>
              </div>
              <div className="chart-bar-container">
                {Object.entries(typeAnalysis).map(([type, data], i) => {
                  const colors = ["blue", "green", "purple", "orange", "teal", "red"];
                  const maxVal = Math.max(...Object.values(typeAnalysis).map(d => d.total));
                  return (
                    <div key={type} className="chart-bar-item">
                      <span className="chart-bar-label">{type}</span>
                      <div className="chart-bar-track">
                        <div
                          className={`chart-bar-fill ${colors[i % colors.length]}`}
                          style={{ width: `${(data.total / maxVal) * 100}%` }}
                        />
                      </div>
                      <span className="chart-bar-value">₹{(data.total / 100000).toFixed(1)}L</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h3>📋 Loan Count by Type</h3>
              </div>
              <div className="chart-bar-container">
                {Object.entries(typeAnalysis).map(([type, data], i) => {
                  const colors = ["purple", "teal", "blue", "orange", "green", "red"];
                  const maxCount = Math.max(...Object.values(typeAnalysis).map(d => d.count));
                  return (
                    <div key={type} className="chart-bar-item">
                      <span className="chart-bar-label">{type}</span>
                      <div className="chart-bar-track">
                        <div
                          className={`chart-bar-fill ${colors[i % colors.length]}`}
                          style={{ width: `${(data.count / maxCount) * 100}%` }}
                        >
                          {data.count}
                        </div>
                      </div>
                      <span className="chart-bar-value">{data.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Risk Assessment */}
        {Object.keys(typeAnalysis).length > 0 && (
          <div className="dashboard-section">
            <div className="section-header">
              <h3>⚠️ Risk Assessment</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Loan Type</th>
                  <th>Total Loans</th>
                  <th>Active</th>
                  <th>Total Value</th>
                  <th>Avg Loan Size</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(typeAnalysis).map(([type, data]) => {
                  const avgSize = data.total / data.count;
                  const risk = avgSize > 2000000 ? "High" : avgSize > 500000 ? "Medium" : "Low";
                  const riskColor = risk === "High" ? "rejected" : risk === "Medium" ? "pending" : "active";
                  return (
                    <tr key={type}>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{type}</td>
                      <td>{data.count}</td>
                      <td>{data.active}</td>
                      <td style={{ fontWeight: 600, color: "var(--success)" }}>
                        ₹{(data.total / 100000).toFixed(1)}L
                      </td>
                      <td>₹{Math.round(avgSize).toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${riskColor}`}>{risk}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Key Insights */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>💡 Key Insights</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
            <div className="card">
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>📈</div>
              <h4 style={{ fontSize: "14px", marginBottom: "4px", color: "var(--text-primary)" }}>Growth Trend</h4>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                {activeLoans.length} active loans generating consistent EMI collections
              </p>
            </div>
            <div className="card">
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>🎯</div>
              <h4 style={{ fontSize: "14px", marginBottom: "4px", color: "var(--text-primary)" }}>Portfolio Size</h4>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                {loans.length} total loans worth ₹{(totalPortfolio / 100000).toFixed(1)}L
              </p>
            </div>
            <div className="card">
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>🏆</div>
              <h4 style={{ fontSize: "14px", marginBottom: "4px", color: "var(--text-primary)" }}>Top Category</h4>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                {Object.entries(typeAnalysis).sort((a, b) => b[1].total - a[1].total)[0]?.[0] || "N/A"} dominates the portfolio
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalystDashboard;
