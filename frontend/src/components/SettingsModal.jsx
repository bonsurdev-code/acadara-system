import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { Bell, Moon, Sun, CheckCircle2 } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, role }) {
  // Local State for settings
  const [notifications, setNotifications] = useState(true);
  const [themePreference, setThemePreference] = useState('dark');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call or LocalStorage save
    setTimeout(() => {
      localStorage.setItem('acadara_theme', themePreference);
      localStorage.setItem('acadara_notifications', notifications);
      
      setIsSaving(false);
      setSaved(true);
      
      // Auto-close after showing success
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Account Settings">
      <div className="space-y-6">
        
        {/* Notifications Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-800 group hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${notifications ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-700 text-slate-500'}`}>
              <Bell size={20} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-white">Push Notifications</span>
              <p className="text-[11px] text-slate-500 leading-tight">
                {role?.toLowerCase() === 'mentor' 
                  ? "Alerts for new mentee matching requests." 
                  : "Alerts for mentor responses and session updates."}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner"></div>
          </label>
        </div>

        {/* Theme Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Interface Mode</span>
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded uppercase">Beta</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setThemePreference('dark')}
              className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all font-bold text-xs ${
                themePreference === 'dark' 
                ? 'border-indigo-600 bg-indigo-600/10 text-white' 
                : 'border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              <Moon size={14} />
              Dark
            </button>
            <button 
              onClick={() => setThemePreference('light')}
              className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all font-bold text-xs ${
                themePreference === 'light' 
                ? 'border-indigo-600 bg-indigo-600/10 text-white' 
                : 'border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              <Sun size={14} />
              Light
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleSave} 
          disabled={isSaving || saved}
          className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all shadow-lg ${
            saved 
            ? 'bg-emerald-600 text-white' 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
          }`}
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saved ? (
            <>
              <CheckCircle2 size={18} />
              Preferences Saved
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </BaseModal>
  );
}