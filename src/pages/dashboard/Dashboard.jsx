import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import useAuth from "../../hooks/useAuth";
import { getBorrowerLoans, getBorrowerPayments } from "../../services/loanService";
import { getLenderLoans } from "../../services/loanService";
import { getAllUsers, getUserStats } from "../../services/loanService";
import { getAllLoansAnalyst, getPaymentAnalytics } from "../../services/loanService";

const Dashboard = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        switch (user?.role) {
          case "borrower": {
            const [loanData, payData] = await Promise.all([
              getBorrowerLoans().catch(() => []),
              getBorrowerPayments().catch(() => []),
            ]);
            setLoans(loanData);
            setPayments(payData);
            break;
          }
          case "lender": {
            const loanData = await getLenderLoans().catch(() => []);
            setLoans(loanData);
            break;
          }
          case "admin": {
            const [userData, statsData] = await Promise.all([
              getAllUsers().catch(() => []),
              getUserStats().catch(() => ({})),
            ]);
            setUsers(userData);
            setStats(statsData);
            break;
          }
          case "analyst": {
            const loanData = await getAllLoansAnalyst().catch(() => []);
            setLoans(loanData);
            break;
          }
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
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
            <p style={{ marginTop: "16px", color: "var(--text-muted)" }}>Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const activeLoans = loans.filter(l => (l.status || "").toUpperCase() === "ACTIVE");
  const pendingLoans = loans.filter(l => (l.status || "").toUpperCase() === "PENDING");
  const totalDisbursed = loans
    .filter(l => ["ACTIVE", "APPROVED", "COMPLETED"].includes((l.status || "").toUpperCase()))
    .reduce((sum, l) => sum + (l.principalAmount || l.amount || 0), 0);
  const totalPaid = payments
    .filter(p => ["COMPLETED", "PAID"].includes((p.status || "").toUpperCase()))
    .reduce((sum, p) => sum + (p.amountPaid || p.amount || 0), 0);

  const recentLoans = [...loans]
    .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
    .slice(0, 5);

  const getStatCards = () => {
    switch (user?.role) {
      case "admin":
        return [
          { icon: "👥", value: stats.totalUsers || users.length || 0, label: "Total Users", color: "blue" },
          { icon: "🏦", value: stats.totalLenders || 0, label: "Lenders", color: "purple" },
          { icon: "👤", value: stats.totalBorrowers || 0, label: "Borrowers", color: "green" },
          { icon: "📊", value: stats.totalAnalysts || 0, label: "Analysts", color: "orange" }
        ];
      case "lender":
        return [
          { icon: "📋", value: loans.length, label: "Loans Issued", color: "blue" },
          { icon: "✅", value: activeLoans.length, label: "Active Loans", color: "green" },
          { icon: "⏳", value: pendingLoans.length, label: "Pending", color: "orange" },
          { icon: "💰", value: `₹${(totalDisbursed / 100000).toFixed(1)}L`, label: "Total Issued", color: "purple" }
        ];
      case "borrower":
        return [
          { icon: "📋", value: loans.length, label: "My Loans", color: "blue" },
          { icon: "✅", value: activeLoans.length, label: "Active", color: "green" },
          { icon: "⏳", value: pendingLoans.length, label: "Pending", color: "orange" },
          { icon: "💰", value: `₹${loans.reduce((s, l) => s + (l.monthlyPayment || l.monthlyEMI || l.emi || 0), 0).toLocaleString()}`, label: "Monthly EMI", color: "red" }
        ];
      case "analyst":
        return [
          { icon: "📊", value: loans.length, label: "Total Loans", color: "purple" },
          { icon: "✅", value: activeLoans.length, label: "Active", color: "green" },
          { icon: "❌", value: loans.filter(l => ["REJECTED", "DEFAULTED"].includes((l.status || "").toUpperCase())).length, label: "Defaulted", color: "red" },
          { icon: "💰", value: `₹${(totalDisbursed / 100000).toFixed(1)}L`, label: "Portfolio Value", color: "blue" }
        ];
      default:
        return [];
    }
  };

  const displayLoan = (loan) => ({
    id: loan.id,
    name: loan.borrowerName || loan.name || "—",
    type: loan.description || loan.type || "Loan",
    amount: loan.principalAmount || loan.amount || 0,
    status: loan.status || "Unknown",
    date: loan.createdAt?.split("T")[0] || loan.startDate || loan.date || "—",
    interest: loan.interestRate || loan.interest || 0,
  });

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-greeting">
          <h2>
            Welcome back, {user?.name || user?.email?.split("@")[0]}
            <span className={`role-badge ${user?.role}`}>
              {user?.avatar} {user?.role}
            </span>
          </h2>
          <p>Here's your overview for today</p>
        </div>

        <div className="stats-grid">
          {getStatCards().map((stat, i) => (
            <div key={i} className={`stat-card ${stat.color}`}>
              <div className="stat-card-icon">{stat.icon}</div>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Admin: Users Table */}
        {user?.role === "admin" && users.length > 0 && (
          <div className="dashboard-section">
            <div className="section-header">
              <h3>👥 Registered Users</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 8).map((u, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "20px" }}>
                          {(u.role || "").toLowerCase() === "admin" ? "👑" :
                           (u.role || "").toLowerCase() === "lender" ? "🏦" :
                           (u.role || "").toLowerCase() === "analyst" ? "📊" : "👤"}
                        </span>
                        <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                          {u.firstName ? `${u.firstName} ${u.lastName || ""}` : u.email}
                        </span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td><span className={`role-badge ${(u.role || "").toLowerCase()}`}>{(u.role || "").toLowerCase()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Lender/Borrower/Analyst: Recent Loans */}
        {user?.role !== "admin" && recentLoans.length > 0 && (
          <div className="dashboard-section">
            <div className="section-header">
              <h3>📋 Recent Loans</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Borrower</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLoans.map((rawLoan, i) => {
                  const loan = displayLoan(rawLoan);
                  return (
                    <tr key={i}>
                      <td style={{ fontFamily: "'Courier New', monospace", color: "var(--primary-400)", fontWeight: 600 }}>
                        {loan.id}
                      </td>
                      <td>{loan.name}</td>
                      <td>{loan.type}</td>
                      <td style={{ fontWeight: 600, color: "var(--success)" }}>
                        ₹{Number(loan.amount).toLocaleString()}
                      </td>
                      <td>
                        <span className={`status-badge ${loan.status.toLowerCase()}`}>
                          {loan.status}
                        </span>
                      </td>
                      <td>{loan.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Loan Status Distribution (analyst/lender) */}
        {(user?.role === "analyst" || user?.role === "lender") && loans.length > 0 && (
          <div className="dashboard-section">
            <div className="section-header">
              <h3>📊 Loan Status Distribution</h3>
            </div>
            <div className="chart-bar-container">
              {Object.entries(
                loans.reduce((acc, l) => {
                  const s = l.status || "Unknown";
                  acc[s] = (acc[s] || 0) + 1;
                  return acc;
                }, {})
              ).map(([status, count], i) => {
                const colors = ["green", "blue", "orange", "red", "purple", "teal"];
                const maxCount = Math.max(...Object.values(
                  loans.reduce((acc, l) => {
                    const s = l.status || "Unknown";
                    acc[s] = (acc[s] || 0) + 1;
                    return acc;
                  }, {})
                ));
                return (
                  <div key={status} className="chart-bar-item">
                    <span className="chart-bar-label">{status}</span>
                    <div className="chart-bar-track">
                      <div
                        className={`chart-bar-fill ${colors[i % colors.length]}`}
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      >
                        {count}
                      </div>
                    </div>
                    <span className="chart-bar-value">{((count / loans.length) * 100).toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Borrower's Loan Progress */}
        {user?.role === "borrower" && loans.filter(l => (l.status || "").toUpperCase() === "ACTIVE").length > 0 && (
          <div className="dashboard-section">
            <div className="section-header">
              <h3>📈 My Loan Progress</h3>
            </div>
            {loans.filter(l => (l.status || "").toUpperCase() === "ACTIVE").map((loan, i) => {
              const totalEmis = loan.termMonths || loan.totalEmis || 1;
              const paidEmis = loan.paidEmis || 0;
              const progress = (paidEmis / totalEmis) * 100;
              return (
                <div key={i} style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>
                      {loan.description || loan.type || "Loan"} ({loan.id})
                    </span>
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                      {paidEmis}/{totalEmis} EMIs paid
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    marginTop: "6px", fontSize: "12px", color: "var(--text-muted)"
                  }}>
                    <span>EMI: ₹{(loan.monthlyPayment || loan.monthlyEMI || 0)?.toLocaleString()}/mo</span>
                    <span>{progress.toFixed(1)}% complete</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {user?.role !== "admin" && loans.length === 0 && (
          <div className="dashboard-section">
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No loans yet</h3>
              <p>Loans will appear here once created</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;