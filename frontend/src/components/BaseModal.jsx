import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function BaseModal({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  maxWidth = "max-w-lg" // Accepts Tailwind max-width classes dynamically
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
            <Motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`relative w-full ${maxWidth} transition-all duration-300 pointer-events-auto my-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass rounded-2xl sm:rounded-3xl border border-slate-700 shadow-2xl overflow-hidden bg-[#1E293B] flex flex-col max-h-[90vh] sm:max-h-[85vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700/50 shrink-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-white truncate pr-2">{title}</h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Scrollable Content Body */}
                <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
                  {children}
                </div>
              </div>
            </Motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}