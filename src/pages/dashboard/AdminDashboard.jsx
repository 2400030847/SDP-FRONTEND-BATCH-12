import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { getAdminDashboard, getAllUsers, getUserStats } from "../../services/loanService";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, statsData] = await Promise.all([
          getAllUsers().catch(() => []),
          getUserStats().catch(() => ({})),
        ]);
        setUsers(userData);
        setLoans(statsData);
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

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="page-header">
          <h2>👑 Admin Panel</h2>
        </div>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-card-icon">👥</div>
            <h3>{loans.totalUsers || users.length || 0}</h3>
            <p>Registered Users</p>
          </div>
          <div className="stat-card green">
            <div className="stat-card-icon">🏦</div>
            <h3>{loans.totalLenders || users.filter(u => (u.role || "").toLowerCase() === "lender").length}</h3>
            <p>Lenders</p>
          </div>
          <div className="stat-card purple">
            <div className="stat-card-icon">👤</div>
            <h3>{loans.totalBorrowers || users.filter(u => (u.role || "").toLowerCase() === "borrower").length}</h3>
            <p>Borrowers</p>
          </div>
          <div className="stat-card orange">
            <div className="stat-card-icon">📊</div>
            <h3>{loans.totalAnalysts || users.filter(u => (u.role || "").toLowerCase() === "analyst").length}</h3>
            <p>Analysts</p>
          </div>
        </div>

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
              {users.map((u, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "22px" }}>
                        {(u.role || "").toLowerCase() === "admin" ? "👑" :
                         (u.role || "").toLowerCase() === "lender" ? "🏦" :
                         (u.role || "").toLowerCase() === "analyst" ? "📊" : "👤"}
                      </span>
                      <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {u.firstName ? `${u.firstName} ${u.lastName || ""}` : u.name || u.email}
                      </span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge ${(u.role || "").toLowerCase()}`}>{(u.role || "").toLowerCase()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  );
};

export default AdminDashboard;