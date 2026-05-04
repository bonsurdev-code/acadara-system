import { Brain } from "lucide-react";
import SidebarComponent from "./SidebarComponent";
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import SettingsModal from "./SettingsModal";
import SecurityModal from "./SecurityModal";
import LogoutModal from "./LogoutModal";
import ProfileComponent from "./ProfileComponent";
import { useAuth } from "../core/api-hooks/useAuth";
import { getInitials } from "../utils/getInitials";

export default function LayoutComponent({ children, navItems, portalType }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
    setActiveModal(null) 
  }

  return (
    <div className="flex h-screen bg-[#0F172A] text-slate-200 overflow-hidden">

      <SidebarComponent navItems={navItems} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 border-b border-slate-800 flex items-center px-8 justify-between bg-[#0F172A]/50 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-bold text-white tracking-tight">Acadara</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                {portalType} Portal
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-bold transition-all shadow-lg
              ${portalType === 'admin' ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 
                portalType === 'mentor' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 
                'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'}
              hover:scale-105 active:scale-95`}
          >
            {getInitials(user?.usr_name)}
          </button>

          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
              <div className="absolute right-8 top-14 z-20">
                <ProfileComponent 
                  role={portalType} 
                  onClose={() => setIsProfileOpen(false)}
                  onOpenModal={(name) => {
                    setActiveModal(name);
                    setIsProfileOpen(false);
                  }}
                />
              </div>
            </>
          )}
        </header>

        <ProfileModal isOpen={activeModal === 'profile'} onClose={() => setActiveModal(null)} role={portalType} />
        <SettingsModal isOpen={activeModal === 'settings'} onClose={() => setActiveModal(null)} role={portalType} />
        <SecurityModal isOpen={activeModal === 'security'} onClose={() => setActiveModal(null)} />
        <LogoutModal isOpen={activeModal === 'logout'} onClose={() => setActiveModal(null)} onConfirm={handleLogout} isLoading={loading}/>
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  )
}
