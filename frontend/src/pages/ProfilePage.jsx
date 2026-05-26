import { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  ShieldAlert, 
  Calendar, 
  LogOut, 
  CheckSquare, 
  ListTodo, 
  TrendingUp 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const { stats, fetchStats } = useContext(TaskContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formattedJoinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <div className="flex-1 p-6 lg:p-8 mt-16 lg:mt-0 overflow-y-auto max-w-4xl mx-auto w-full">
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-xs font-extrabold uppercase tracking-widest text-primary-400">
          User Settings
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
          Your Account Profile
        </h1>
        <p className="text-sm text-dark-400">
          Review your account metrics and active workspace profile details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6 rounded-3xl border border-dark-850 text-center flex flex-col items-center justify-between md:col-span-1"
        >
          <div className="flex flex-col items-center">
            {/* User Big Avatar Icon */}
            <div className="w-20 h-20 rounded-3xl bg-primary-600/10 border border-primary-500/25 text-primary-400 flex items-center justify-center font-extrabold text-3xl select-none mb-4 uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            
            <h2 className="font-extrabold text-lg text-white truncate max-w-full">
              {user?.name || 'Workspace User'}
            </h2>
            <p className="text-xs text-dark-450 truncate max-w-full mt-0.5">
              {user?.email || 'user@example.com'}
            </p>

            <span className="inline-block text-[10px] font-bold text-primary-400 bg-primary-500/10 px-2.5 py-1 rounded-full border border-primary-500/20 uppercase mt-3 tracking-wider">
              Student / Professional
            </span>
          </div>

          <div className="w-full border-t border-dark-800/60 pt-5 mt-6 space-y-3.5 text-left">
            <div className="flex items-center gap-3 text-xs text-dark-400">
              <Calendar className="w-4 h-4 text-dark-500 shrink-0" />
              <span>Joined: <strong>{formattedJoinDate}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-xs text-dark-400">
              <ShieldAlert className="w-4 h-4 text-dark-500 shrink-0" />
              <span>Security Tier: <strong>JWT Secure API</strong></span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full mt-6 py-3 rounded-xl font-semibold text-sm text-rose-450 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all select-none"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </motion.div>

        {/* Right Side Settings and Stats forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile details form display */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 rounded-3xl border border-dark-850"
          >
            <h3 className="font-extrabold text-base text-white mb-5">Profile Information</h3>
            
            <div className="space-y-4">
              {/* Display full name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-dark-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    readOnly
                    value={user?.name || ''}
                    className="w-full bg-dark-800/20 border border-dark-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-dark-300 focus:outline-none cursor-default font-medium"
                  />
                </div>
              </div>

              {/* Display email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-dark-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    readOnly
                    value={user?.email || ''}
                    className="w-full bg-dark-800/20 border border-dark-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-dark-300 focus:outline-none cursor-default font-medium"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Performance & workspace aggregates summary */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-3xl border border-dark-850"
          >
            <h3 className="font-extrabold text-base text-white mb-5">Workspace Efficiency</h3>

            <div className="grid grid-cols-3 gap-4 text-center">
              {/* Total stats */}
              <div className="bg-dark-800/30 p-4 rounded-2xl border border-dark-805">
                <ListTodo className="w-5 h-5 text-primary-400 mx-auto mb-1.5" />
                <span className="block text-[10px] font-bold text-dark-450 uppercase tracking-wide">
                  Total
                </span>
                <span className="block text-xl font-black text-white mt-1">
                  {stats.totalTasks}
                </span>
              </div>

              {/* Completed stats */}
              <div className="bg-dark-800/30 p-4 rounded-2xl border border-dark-805">
                <CheckSquare className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                <span className="block text-[10px] font-bold text-dark-450 uppercase tracking-wide">
                  Finished
                </span>
                <span className="block text-xl font-black text-white mt-1">
                  {stats.completedTasks}
                </span>
              </div>

              {/* Progress percentage */}
              <div className="bg-dark-800/30 p-4 rounded-2xl border border-dark-805">
                <TrendingUp className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
                <span className="block text-[10px] font-bold text-dark-450 uppercase tracking-wide">
                  Ratio
                </span>
                <span className="block text-xl font-black text-white mt-1">
                  {stats.progress}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
