import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Login = () => {
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    setLoading(true);
    const res = await login(email.trim(), password.trim());
    setLoading(false);

    if (res.success) {
      showToast('Welcome back! Let\'s get productive today. ⚡', 'success');
      navigate('/');
    } else {
      setErrorMsg(res.error || 'Login failed');
      showToast(res.error || 'Login failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 glowing-grid flex flex-col justify-center items-center p-4">
      {/* Brand logo at top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-6"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-white select-none">
          ZenFlow
        </span>
      </motion.div>

      {/* Main glass card container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-2xl relative border border-dark-850"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-white">Sign In</h2>
          <p className="text-xs text-dark-400 mt-1.5">
            Log in to manage and streamline your projects
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm mb-5 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input field */}
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
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-800/40 hover:bg-dark-800 focus:bg-dark-900 border border-dark-750 focus:border-primary-500 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/15 transition-all placeholder-dark-500"
              />
            </div>
          </div>

          {/* Password input field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-400">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-dark-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-800/40 hover:bg-dark-800 focus:bg-dark-900 border border-dark-750 focus:border-primary-500 rounded-xl pl-11 pr-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/15 transition-all placeholder-dark-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-dark-500 hover:text-dark-300 transition-colors"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Sign In action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-primary-500/15 transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01] mt-6"
          >
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : null}
            <span>Log In</span>
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-dark-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-400 font-semibold hover:text-primary-300 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
