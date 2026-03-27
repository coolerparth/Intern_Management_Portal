import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Badge from "../ui/Badge";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getPageTitle = (pathname) => {
    const pathPart = pathname.split('/').pop();
    if (pathPart === 'dashboard') return 'Overview';
    return pathPart ? pathPart.charAt(0).toUpperCase() + pathPart.slice(1) : 'Dashboard';
  };

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Left: Branding & Page Name */}
          <div className="flex flex-1 items-center space-x-4 md:space-x-6">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={onMenuClick}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20 shrink-0">
              <span className="text-white font-bold text-xl select-none">I</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-100 hidden md:block shrink-0"></div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                {getPageTitle(location.pathname)}
              </h1>
              {user?.role && (
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
                  Portal Access / {user.role}
                </p>
              )}
            </div>
          </div>

          {/* Right: User Perspective */}
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-4 pr-6 border-r border-slate-100">
               <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || user?.email?.split('@')[0]}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">{user?.email}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-bold">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
               </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={logout}
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
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
