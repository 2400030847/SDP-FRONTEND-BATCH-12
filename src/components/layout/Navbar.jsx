import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-brand">
        <span className="logo-icon">🏦</span>
        <h2>LoanVault</h2>
      </div>
      {user && (
        <div className="navbar-user">
          <div className="navbar-user-info">
            <span className="navbar-avatar">{user.avatar || "👤"}</span>
            <div className="navbar-user-text">
              <span className="navbar-user-name">{user.name || user.email}</span>
              <span className="navbar-user-role">{user.role}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
