import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import BaseModal from './BaseModal';
import { useAuth } from '../core/api-hooks/useAuth';

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const payload = {
      ...Object.fromEntries(data.entries())
    };

    await register(payload);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Create Your Mentee Account">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
            {error}
          </p>
        )}

        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Full Name</label>
          <div className="relative pt-1">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              name="usr_name"
              placeholder="John Doe"
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Email Address</label>
          <div className="relative pt-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              name="usr_email"
              placeholder="you@example.com"
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Password</label>
          <div className="relative pt-1">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type={showPassword ? "text" : "password"}
              name="usr_password"
              placeholder="Min 8 characters"
              required
              minLength={8}
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 mt-2 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Motion.button>

        {/* Switch to Login */}
        <p className="text-center text-slate-400 text-sm">
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={onSwitchToLogin} 
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Sign in
          </button>
        </p>
      </form>
    </BaseModal>
  );
}