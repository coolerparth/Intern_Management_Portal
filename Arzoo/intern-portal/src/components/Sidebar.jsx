import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard, Bell, Users, CheckSquare, FileText,
  ClipboardList, LogOut, GraduationCap
} from "lucide-react";

const iconMap = {
  "/dashboard": LayoutDashboard,
  "/notifications": Bell,
  "/interns": Users,
  "/tasks": CheckSquare,
  "/reports": FileText,
  "/evaluations": ClipboardList,
  "/forms": ClipboardList,
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getMenuItems = () => {
    const common = [
      { path: "/dashboard", label: "Dashboard" },
      { path: "/notifications", label: "Notifications" },
    ];

    if (user?.role === "admin") {
      return [
        ...common,
        { path: "/interns", label: "All Interns" },
        { path: "/evaluations", label: "Evaluations" },
        { path: "/forms", label: "Forms" },
        { path: "/reports", label: "Reports" },
      ];
    }

    if (user?.role === "teamlead") {
      return [
        ...common,
        { path: "/interns", label: "My Interns" },
        { path: "/tasks", label: "Tasks" },
        { path: "/reports", label: "Reports" },
        { path: "/evaluations", label: "Evaluations" },
      ];
    }

    if (user?.role === "supervisor") {
      return [
        ...common,
        { path: "/interns", label: "Interns" },
        { path: "/reports", label: "Reports" },
        { path: "/evaluations", label: "Evaluations" },
      ];
    }

    return [
      ...common,
      { path: "/tasks", label: "My Tasks" },
      { path: "/reports", label: "My Reports" },
      { path: "/evaluations", label: "My Marks" },
      { path: "/forms", label: "Forms" },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground tracking-tight">Intern Portal</h1>
            <p className="text-[11px] text-muted-foreground leading-none">Management System</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* User Info */}
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {user?.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-primary capitalize">
              {user?.role === "teamlead" ? "Team Lead" : user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
          Menu
        </p>
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = iconMap[item.path] || FileText;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground font-medium shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator />

      {/* Logout */}
      <div className="p-3">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
