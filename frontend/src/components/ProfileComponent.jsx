import { User, Settings, ShieldCheck, LogOut, X } from 'lucide-react';
import { ROLE_STYLES } from '../constants/Themes';
import MenuButtonComponent from './MenuButtonComponent';
import { getInitials } from '../utils/getInitials';
import { useAuth } from '../core/api-hooks/useAuth';

export default function ProfileComponent({ onClose, role, onOpenModal }) {
  const theme = ROLE_STYLES[role];
  const { user, loading } = useAuth();

  return (
    <div className="w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in zoom-in duration-200">
      {/* Header Section */}
      <div className="bg-linear-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-800">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-lg ${theme.icon}`}>
            {getInitials(user?.usr_name)}
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-slate-800 rounded w-1/2"></div>
          </div>
        ) : (
          <>
            <h3 className="text-white font-bold truncate">{user?.usr_name || "User"}</h3>
            <p className="text-xs text-slate-400 truncate mt-0.5">{user?.usr_email || "No email"}</p>
          </>
        )}

        <span className={`inline-block mt-3 px-2 py-0.5 border rounded-md text-[10px] font-bold uppercase tracking-wider ${theme.badge}`}>
          {role} Account
        </span>
      </div>

      {/* Actions Section */}
      <div className="p-2">
        {role !== 'admin' && (
          <>
            <MenuButtonComponent icon={User} label="My Profile" onClick={() => onOpenModal('profile') } />
            <MenuButtonComponent icon={Settings} label="Settings" onClick={() => onOpenModal('settings')} />
          </>
        )}
        <MenuButtonComponent icon={ShieldCheck} label="Security" onClick={() => onOpenModal('security')} />
      </div>

      {/* Footer Section */}
      <div className="p-2 bg-slate-950/50 border-t border-slate-800">
        <MenuButtonComponent icon={LogOut} label="Sign Out" onClick={() => onOpenModal('logout')} variant="danger" />
      </div>
    </div>
  );
}