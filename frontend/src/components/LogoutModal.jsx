import { LogOut, AlertCircle, Loader2 } from 'lucide-react';
import BaseModal from './BaseModal';

export default function LogoutModal({ isOpen, onClose, onConfirm, isLoading }) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Confirm Sign Out">
      <div className="flex flex-col items-center text-center py-4">
        {/* Animated Icon Container */}
        <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
          isLoading 
            ? 'bg-indigo-500/10 border-indigo-500/30' 
            : 'bg-red-500/10 border-red-500/20'
        } border`}>
          {/* Spinning Loader */}
          <Loader2 
            size={32} 
            className={`absolute text-indigo-500 animate-spin transition-all duration-300 ${
              isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`} 
          />
          {/* Static Alert Icon */}
          <AlertCircle 
            size={32} 
            className={`absolute text-red-500 transition-all duration-300 ${
              isLoading ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
            }`} 
          />
        </div>

        {/* Title with fade transition */}
        <h3 className={`text-xl font-bold transition-colors duration-300 ${
          isLoading ? 'text-indigo-400' : 'text-white'
        } mb-2`}>
          {isLoading ? 'Signing Out...' : 'Are you sure?'}
        </h3>
        
        <p className="text-slate-400 text-sm leading-relaxed max-w-240px">
          {isLoading ? (
            <span className="animate-pulse">Please wait while we securely sign you out...</span>
          ) : (
            <>
              You are about to sign out of <span className="text-indigo-400 font-bold">Acadara</span>.
            </>
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-3 mt-10">
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg disabled:cursor-not-allowed disabled:active:scale-100 ${
              isLoading 
                ? 'bg-slate-700 text-slate-400' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Signing Out...</span>
              </>
            ) : (
              <>
                <LogOut size={18} /> Sign Me Out
              </>
            )}
          </button>
          
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className={`w-full font-bold py-3.5 rounded-xl border transition-colors ${
              isLoading 
                ? 'bg-slate-800/50 text-slate-600 border-slate-800 cursor-not-allowed' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </BaseModal>
  );
}