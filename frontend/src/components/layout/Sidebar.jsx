import { Link, useLocation } from "react-router-dom";
import {
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  TrophyIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Sidebar = ({ role, onClose }) => {
  const location = useLocation();

  const navItems = {
    admin: [
      { path: "/admin/dashboard", label: "Dashboard", icon: ChartBarIcon },
      { path: "/admin/users", label: "Users", icon: UsersIcon },
      { path: "/admin/forms", label: "Forms", icon: DocumentDuplicateIcon }
    ],
    teamlead: [
      { path: "/teamlead/dashboard", label: "Dashboard", icon: ChartBarIcon },
      { path: "/teamlead/interns", label: "Interns", icon: UsersIcon },
      { path: "/teamlead/tasks", label: "Tasks", icon: ClipboardDocumentListIcon },
      { path: "/teamlead/reports", label: "Reports", icon: DocumentTextIcon },
      { path: "/teamlead/leaderboard", label: "Leaderboard", icon: TrophyIcon }
    ],
    supervisor: [
      { path: "/supervisor/dashboard", label: "Oversight Board", icon: ChartBarIcon },
      { path: "/supervisor/interns", label: "Interns", icon: UsersIcon },
      { path: "/supervisor/tasks", label: "Tasks", icon: ClipboardDocumentListIcon },
      { path: "/supervisor/reports", label: "Reports", icon: DocumentTextIcon },
      { path: "/supervisor/forms", label: "Forms", icon: DocumentDuplicateIcon }
    ],
    intern: [
      { path: "/intern/dashboard", label: "Dashboard", icon: ChartBarIcon },
      { path: "/intern/tasks", label: "Tasks", icon: ClipboardDocumentListIcon },
      { path: "/intern/reports", label: "Reports", icon: DocumentTextIcon }
    ]
  };

  return (
    <div className="h-full w-full bg-green-600 text-white p-5 flex flex-col overflow-y-auto shadow-xl">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
            <span className="text-green-600 font-bold text-xl">I</span>
          </div>
          <h2 className="text-2xl font-bold tracking-wide break-words line-clamp-1">Intern Portal</h2>
        </div>
        <button className="md:hidden p-1 bg-green-700/50 rounded-lg" onClick={onClose}>
          <XMarkIcon className="w-6 h-6 text-white" />
        </button>
      </div>

      <nav className="flex flex-col space-y-2">
        {navItems[role]?.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? "bg-green-700 text-white shadow-md shadow-green-700/50"
                  : "text-green-50 hover:bg-green-500/50 hover:text-white"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto p-4 bg-green-700/50 rounded-xl">
        <p className="text-xs text-green-100 font-medium text-center">
          Intern Portal v1.0
        </p>
      </div>
    </div>
  );
};

export default Sidebar;