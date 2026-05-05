import { Brain, Menu, X, ChevronRight } from "lucide-react";
import SidebarComponent from "./SidebarComponent";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import SettingsModal from "./SettingsModal";
import SecurityModal from "./SecurityModal";
import LogoutModal from "./LogoutModal";
import ProfileComponent from "./ProfileComponent";
import { useAuth } from "../core/api-hooks/useAuth";
import { getInitials } from "../utils/getInitials";
import { motion as Motion, AnimatePresence } from "framer-motion";

export default function LayoutComponent({ children, navItems, portalType }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setActiveModal(null);
  };

  return (
    <div className="flex h-screen w-full bg-[#0F172A] text-slate-200 overflow-hidden">
      
      {/* DESKTOP SIDEBAR: Fixed height to screen, only visible lg and up */}
      <aside className="hidden lg:flex h-screen">
        <SidebarComponent navItems={navItems} />
      </aside>

      {/* MOBILE SIDEBAR (Dedicated Version) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md z-[60] lg:hidden"
            />
            
            {/* Drawer */}
            <Motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-[#0F172A] border-r border-slate-800 z-[70] lg:hidden flex flex-col"
            >
              {/* Mobile Sidebar Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-white text-lg">Acadara</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname.includes(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                        isActive 
                          ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400' 
                          : 'text-slate-400 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon size={20} />
                        <span className="font-semibold">{item.name}</span>
                      </div>
                      <ChevronRight size={16} className={isActive ? "opacity-100" : "opacity-0"} />
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Sidebar Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/30">
                <div className="flex items-center gap-3 p-2">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold border border-slate-700">
                    {getInitials(user?.usr_name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white truncate w-32">{user?.usr_name}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{portalType}</span>
                  </div>
                </div>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative h-full">
        <header className="h-16 border-b border-slate-800 flex items-center px-4 lg:px-8 justify-between bg-[#0F172A]/50 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Brain className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg lg:text-2xl font-bold text-white tracking-tight leading-none">Acadara</span>
                <span className="text-[8px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 lg:mt-1">
                  {portalType} Portal
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-9 h-9 lg:w-10 lg:h-10 rounded-full border flex items-center justify-center text-xs font-bold transition-all shadow-lg
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
              <div className="absolute right-4 lg:right-8 top-14 z-20">
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

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>

        {/* MODALS */}
        <ProfileModal isOpen={activeModal === 'profile'} onClose={() => setActiveModal(null)} role={portalType} />
        <SettingsModal isOpen={activeModal === 'settings'} onClose={() => setActiveModal(null)} role={portalType} />
        <SecurityModal isOpen={activeModal === 'security'} onClose={() => setActiveModal(null)} />
        <LogoutModal isOpen={activeModal === 'logout'} onClose={() => setActiveModal(null)} onConfirm={handleLogout} isLoading={loading}/>
      </main>
    </div>
  );
}