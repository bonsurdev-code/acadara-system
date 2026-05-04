import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function SidebarComponent({ navItems }) {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <aside className={`relative border-r border-slate-800 bg-[#020617] flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-12 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 transition-all z-50 shadow-lg"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
      
      <nav className="flex-1 px-3 space-y-2 pt-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.name : ''}
              className={`flex items-center rounded-xl transition-all duration-200 group border ${
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
              } ${
                isActive 
                ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent'
              }`}
            >
              <Icon size={22} className={`${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-200'}`} />
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50 text-center">
         {!isCollapsed && <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">v1.0.0-beta</span>}
      </div>
    </aside>
  )
}
