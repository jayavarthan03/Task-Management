import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      html.classList.add('light');
      setIsDarkMode(false);
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/tasks', label: 'Tasks Board', icon: <CheckSquare className="w-5 h-5" /> },
    { path: '/profile', label: 'User Profile', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <>
      {/* Mobile Top Navbar with hamburger toggle */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-dark-900 border-b border-dark-800 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ZenFlow</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-dark-800 text-dark-100 border border-dark-700 hover:bg-dark-700 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar navigation container */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-dark-900/90 backdrop-blur-xl border-r border-dark-800/60 p-6 transition-all duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and Brand */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
                ZenFlow
              </span>
              <span className="block text-[10px] text-primary-400 font-semibold tracking-wider uppercase">
                Task Workspace
              </span>
            </div>
          </div>
          {/* Close button inside mobile menu */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 rounded-lg bg-dark-800 text-dark-300 border border-dark-750 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Mini Profile widget */}
        {user && (
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-dark-800/40 border border-dark-800 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-600/10 border border-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-lg select-none uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm text-dark-100 truncate">{user.name}</h4>
              <p className="text-xs text-dark-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Main Navigation Links */}
        <nav className="flex-1 space-y-1.5">
          <span className="block text-[10px] text-dark-500 font-bold uppercase tracking-widest pl-3 mb-2">
            Main Menu
          </span>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 border ${
                  isActive
                    ? 'bg-primary-600/10 border-primary-500/25 text-primary-400 shadow-sm shadow-primary-500/5'
                    : 'bg-transparent border-transparent text-dark-400 hover:bg-dark-800/40 hover:text-dark-200'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Quick actions at bottom (Theme toggle, Logout) */}
        <div className="border-t border-dark-800/80 pt-6 space-y-3">
          {/* Light/Dark mode toggler */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium bg-dark-800/30 text-dark-400 hover:text-dark-100 border border-dark-800 hover:bg-dark-800/60 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <div className={`w-8 h-4 rounded-full bg-dark-700 relative transition-colors duration-200 ${isDarkMode ? 'bg-primary-600' : ''}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-200 ${isDarkMode ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-3.5 rounded-xl font-medium text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent hover:border-rose-500/20 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overlay to close sidebar on mobile tap */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity"
        />
      )}
    </>
  );
};

export default Sidebar;
