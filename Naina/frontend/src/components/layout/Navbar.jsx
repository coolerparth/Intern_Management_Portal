import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Badge from "../ui/Badge";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getPageTitle = (pathname) => {
    const pathPart = pathname.split('/').pop();
    return pathPart ? pathPart.charAt(0).toUpperCase() + pathPart.slice(1) : 'Dashboard';
  };

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo/Title */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <div>
<h1 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text">{getPageTitle(location.pathname)}</h1>
              {user?.role && (
                <p className="text-xs text-gray-500 capitalize">{user.role.replace(/^\w/, c => c.toUpperCase())} Dashboard</p>
              )}
            </div>
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications - Placeholder */}
            <button className="px-3 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl shadow-sm transition-all relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.142 6 8.466 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Badge variant={user?.role === 'admin' ? 'success' : user?.role === 'teamlead' ? 'default' : 'warning'}>
                  {user?.role?.toUpperCase()}
                </Badge>
                <span className="text-sm font-medium text-gray-900">{user?.name || user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="px-3 py-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl shadow-sm transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

