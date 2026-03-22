import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ role }) => {
  const location = useLocation();

  const navItems = {
    admin: [
      { path: "/admin/dashboard", label: "Dashboard" },
      { path: "/admin/users", label: "Users" },
      { path: "/admin/forms", label: "Forms" }
    ],
    teamlead: [
      { path: "/teamlead/dashboard", label: "Dashboard" },
      { path: "/teamlead/interns", label: "Interns" },
      { path: "/teamlead/tasks", label: "Tasks" },
      { path: "/teamlead/reports", label: "Reports" },
      { path: "/teamlead/leaderboard", label: "Leaderboard" }
    ],
    intern: [
      { path: "/intern/dashboard", label: "Dashboard" },
      { path: "/intern/tasks", label: "Tasks" },
      { path: "/intern/reports", label: "Reports" }
    ]
  };

  return (
    <div style={{
      height: "100vh",
      background: "#16a34a",
      color: "white",
      padding: "20px"
    }}>
      <h2 style={{ marginBottom: "20px" }}>Intern Portal</h2>

      {navItems[role]?.map(item => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            display: "block",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
            background:
              location.pathname === item.path ? "#15803d" : "transparent",
            color: "white",
            textDecoration: "none"
          }}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;