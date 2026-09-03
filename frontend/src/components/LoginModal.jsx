import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import BaseModal from './BaseModal';
import { useAuth } from '../core/api-hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginModal({ isOpen, onClose, onSwitchToSignup, onTriggerOTPVerification }) {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('login'); // 'login' | 'otp'
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const [resending, setResending] = useState(false);

  const { login, verifyOTP, resendOTP, loading, error, setError, oauthLogin } = useAuth();

  const handleReset = () => {
    setStep('login');
    setOtp('');
    setResendMsg('');
    setUnverifiedEmail('');
    setError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      console.log("Google response:", tokenResponse);
      await oauthLogin("google", tokenResponse.access_token);
      handleClose();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());

    try {
      await login(payload);
      handleClose();
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.is_unverified) {
        setUnverifiedEmail(payload.usr_email);

        // Automatically trigger an OTP resend for unverified login attempts
        try {
          await resendOTP({ usr_email: payload.usr_email });
          setResendMsg('A new verification code has been sent to your email.');
        } catch {
          // If resend fails, user can still attempt manual resend from the OTP step
        }

        if (onTriggerOTPVerification) {
          onTriggerOTPVerification(payload.usr_email);
        } else {
          setStep('otp');
        }
      }
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOTP({ usr_email: unverifiedEmail, otp });
      handleClose();
    } catch {
      // Error handling is managed inside useAuth hook
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendMsg('');
    try {
      const res = await resendOTP({ usr_email: unverifiedEmail });
      setResendMsg(res.message || 'Verification code resent!');
    } catch {
      // Error handling is managed inside useAuth hook
    } finally {
      setResending(false);
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={step === 'login' ? "Welcome Back" : "Verify Your Email"}
    >
      {step === 'login' ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
              {error}
            </p>
          )}

          {/* Email Field */}
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

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative pt-1">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="usr_password"
                placeholder="••••••••"
                required
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
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Motion.button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-[#1E293B] text-sm text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-1 gap-3">
            <Motion.button
              type="button"
              onClick={() => handleGoogleLogin()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-medium">Google</span>
            </Motion.button>
          </div>

          {/* Switch to Signup */}
          <p className="text-center text-slate-400 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Sign up
            </button>
          </p>
        </form>
      ) : (
        /* Inline OTP Verification step for unverified account logins */
        <form onSubmit={handleOTPSubmit} className="space-y-5">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-300">
              Your account requires verification.<br />
              Enter the code sent to <span className="font-semibold text-white">{unverifiedEmail}</span>
            </p>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
              {error}
            </p>
          )}

          {resendMsg && (
            <p className="text-emerald-400 text-sm text-center bg-emerald-400/10 py-2 rounded-lg border border-emerald-400/20">
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
              'Verify & Login'
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
              Back to Login
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
}