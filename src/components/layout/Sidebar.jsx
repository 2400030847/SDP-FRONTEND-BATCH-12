import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "active" : "";

  const menuItems = [
    { icon: "📊", label: "Dashboard", path: "/dashboard", roles: ["admin", "lender", "borrower", "analyst"] },
    { icon: "📝", label: "Apply Loan", path: "/apply-loan", roles: ["borrower"] },
    { icon: "📋", label: "Loan History", path: "/loan-history", roles: ["admin", "lender", "borrower", "analyst"] },
    { icon: "💳", label: "Payments", path: "/payments", roles: ["admin", "lender", "borrower", "analyst"] },
  ];

  const adminItems = [
    { icon: "👑", label: "Admin Panel", path: "/admin", roles: ["admin"] },
    { icon: "🏦", label: "Lender View", path: "/lender", roles: ["lender"] },
    { icon: "👤", label: "Borrower View", path: "/borrower", roles: ["borrower"] },
    { icon: "📊", label: "Analytics", path: "/analytics", roles: ["admin", "analyst"] },
  ];

  const filterByRole = (items) =>
    items.filter(item => item.roles.includes(user?.role));

  return (
    <div className="sidebar">
      <div className="sidebar-section-title">Main Menu</div>
      {filterByRole(menuItems).map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`sidebar-link ${isActive(item.path)}`}
        >
          <span className="sidebar-icon">{item.icon}</span>
          {item.label}
        </Link>
      ))}

      {filterByRole(adminItems).length > 0 && (
        <>
          <div className="sidebar-section-title">Management</div>
          {filterByRole(adminItems).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive(item.path)}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </>
      )}
    </div>
  );
};

export default Sidebar;
