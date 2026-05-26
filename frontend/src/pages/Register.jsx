import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, User, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Register = () => {
  const { register } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Form-level validation checks
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await register(name.trim(), email.trim(), password.trim());
    setLoading(false);

    if (res.success) {
      showToast('Registration successful! Welcome to ZenFlow! ⚡', 'success');
      navigate('/');
    } else {
      setErrorMsg(res.error || 'Registration failed');
      showToast(res.error || 'Registration failed', 'error');
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
          <h2 className="text-2xl font-extrabold text-white">Create Account</h2>
          <p className="text-xs text-dark-400 mt-1.5">
            Sign up to unlock and start organizing your tasks
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm mb-5 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name input field */}
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
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark-800/40 hover:bg-dark-800 focus:bg-dark-900 border border-dark-750 focus:border-primary-500 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/15 transition-all placeholder-dark-500"
              />
            </div>
          </div>

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
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-dark-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
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

          {/* Confirm Password input field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-dark-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-dark-800/40 hover:bg-dark-800 focus:bg-dark-900 border border-dark-750 focus:border-primary-500 rounded-xl pl-11 pr-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/15 transition-all placeholder-dark-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-dark-500 hover:text-dark-300 transition-colors"
                title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-primary-500/15 transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01] mt-6"
          >
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : null}
            <span>Sign Up</span>
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-dark-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-400 font-semibold hover:text-primary-300 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
