import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { ChevronLeft, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useUserService } from '../core/api-hooks/useUserService';

const PasswordInput = ({ label, placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-white focus:border-indigo-500 outline-none transition-all"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-indigo-400 transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

const ActionButton = ({ label, icon: Icon, onClick, primary }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm font-bold transition-all group ${
      primary
        ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20'
        : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 text-slate-300'
    }`}
  >
    <div className="flex items-center gap-3">
      {Icon && (
        <Icon
          size={18}
          className={primary ? 'text-indigo-400' : 'text-slate-500'}
        />
      )}
      {label}
    </div>
    <ArrowRight
      size={16}
      className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
    />
  </button>
);

export default function SecurityModal({ isOpen, onClose }) {
  const [view, setView] = useState('menu');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // TOAST STATE
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const { updateUserPassword, loading, error } = useUserService();

  // Handle toast auto-hide
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setView('menu');
      setCurrentPassword('');
      setNewPassword('');
    }, 300);
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) return;

    try {
      await updateUserPassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      // Show Success Toast
      setToast({
        show: true,
        message: 'Password updated successfully!',
        type: 'success'
      });

      // Reset + go back
      setCurrentPassword('');
      setNewPassword('');
      setView('menu');
    } catch (err) {
      // Optional: Show error toast if backend error occurs
      console.error(err);
    }
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={handleClose}
        title={view === 'menu' ? 'Privacy & Security' : 'Change Password'}
      >
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            {view === 'menu' ? (
              <Motion.div
                key="menu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-sm text-slate-400 mb-6">
                  Manage your account security and authentication methods.
                </p>

                <ActionButton
                  label="Change Password"
                  icon={Lock}
                  primary
                  onClick={() => setView('password')}
                />
              </Motion.div>
            ) : (
              <Motion.div
                key="password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <button
                  onClick={() => setView('menu')}
                  className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors mb-4"
                >
                  <ChevronLeft size={14} /> Back to Security
                </button>

                <div className="space-y-4">
                  <PasswordInput
                    label="Current Password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />

                  <PasswordInput
                    label="New Password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-xs font-semibold px-1">{error}</p>
                )}

                <button
                  onClick={handleUpdatePassword}
                  disabled={loading || !currentPassword || !newPassword}
                  className="w-full py-4 mt-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </BaseModal>

      {/* SUCCESS TOAST - Rendered outside BaseModal but inside the component */}
      <AnimatePresence>
        {toast.show && (
          <Motion.div 
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-6 right-6 lg:top-10 lg:right-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl glass border border-white/10 shadow-2xl bg-slate-900/80 backdrop-blur-xl"
          >
            <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
              <CheckCircle2 size={20} />
            </div>
            <p className="text-sm font-bold text-white">{toast.message}</p>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}