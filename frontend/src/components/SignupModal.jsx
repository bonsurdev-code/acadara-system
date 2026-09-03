import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, ShieldCheck, RefreshCw } from 'lucide-react';
import BaseModal from './BaseModal';
import { useAuth } from '../core/api-hooks/useAuth';

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('signup'); // 'signup' | 'otp'
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const [resending, setResending] = useState(false);
  const [otpNotice, setOtpNotice] = useState(''); // Banner message specifically for OTP step

  const { register, verifyOTP, resendOTP, loading, error, setError } = useAuth();

  const handleReset = () => {
    setStep('signup');
    setOtp('');
    setResendMsg('');
    setOtpNotice('');
    setError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setOtpNotice('');

    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());

    try {
      await register(payload);
      setRegisteredEmail(payload.usr_email);
      setError(null);
      setStep('otp');
    } catch (err) {
      // Check backend payload structure directly from Axios response
      const resData = err.response?.data;

      if (resData?.is_unverified) {
        // 1. UNVERIFIED USER: Navigate to OTP step
        const email = payload.usr_email;
        setRegisteredEmail(email);
        setStep('otp');
        
        const message =
          resData?.message ||
          'Email is already registered but unverified. Please enter your OTP.';
        setOtpNotice(message);

        // Clear global error so it doesn't leak red banner into OTP view
        setError(null);

        // Trigger OTP resend silently without letting errors mutate state
        resendOTP({ usr_email: email }).catch(() => {});
      } else {
        // 2. VERIFIED USER OR OTHER ERROR: Stay on 'signup' step
        setStep('signup');
        setOtpNotice('');
        // Global hook error set inside AuthProvider will display on Signup form
      }
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await verifyOTP({ usr_email: registeredEmail, otp });
      handleClose();
      window.location.reload();
    } catch {
      // Error state handled inside useAuth hook
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendMsg('');
    setError(null);
    try {
      const res = await resendOTP({ usr_email: registeredEmail });
      setResendMsg(res?.message || 'Verification code resent!');
    } catch {
      // Error state handled inside useAuth hook
    } finally {
      setResending(false);
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={step === 'signup' ? "Create Your Mentee Account" : "Verify Your Email"}
    >
      {step === 'signup' ? (
        <form onSubmit={handleSignupSubmit} className="space-y-5">
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 px-3 rounded-lg border border-red-400/20">
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
      ) : (
        /* OTP Step */
        <form onSubmit={handleOTPSubmit} className="space-y-5">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-300">
              Enter the 6-digit verification code for <br />
              <span className="font-semibold text-white">{registeredEmail}</span>
            </p>
          </div>

          {/* Special Notice Banner when re-entering via unverified registration */}
          {otpNotice && (
            <p className="text-amber-400 text-sm text-center bg-amber-400/10 py-2.5 px-3 rounded-lg border border-amber-400/20">
              {otpNotice}
            </p>
          )}

          {/* Standard error banner from useAuth verification failures */}
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 px-3 rounded-lg border border-red-400/20">
              {error}
            </p>
          )}

          {resendMsg && (
            <p className="text-emerald-400 text-sm text-center bg-emerald-400/10 py-2 px-3 rounded-lg border border-emerald-400/20">
              {resendMsg}
            </p>
          )}

          <div className="space-y-2">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              required
              className="w-full py-3.5 text-center text-2xl tracking-[0.5em] font-mono rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <Motion.button
            type="submit"
            disabled={loading || otp.length !== 6}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Verify Code'
            )}
          </Motion.button>

          <div className="flex items-center justify-between text-sm pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              Resend Code
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Back to Signup
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
}