import React, { useState, useEffect } from 'react';
import { adminService } from '../../core/api-services/admin.service';
import { 
  Check, 
  X, 
  ExternalLink, 
  MessageSquare, 
  Clock, 
  FileText, 
  UserCheck, 
  Briefcase, 
  Mail, 
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

export default function MentorRequest() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  
  // Modal & Toast States
  const [modalConfig, setModalConfig] = useState({ show: false, appId: null, status: null });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await adminService.getApplications(filter);
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  const handleStatusUpdate = async () => {
    const { appId, status } = modalConfig;
    setIsUpdating(true);
    try {
      await adminService.updateApplicationStatus(appId, status);
      
      const successMsg = status === 'approved' 
        ? "Mentor approved! Account credentials have been dispatched." 
        : "Application has been rejected.";
      
      showToast(successMsg, status === 'approved' ? 'success' : 'info');
      setModalConfig({ show: false, appId: null, status: null });
      fetchApplications();
    } catch (err) {
      showToast("Operation failed. Please check connection.", "error");
      console.error("Failed to update application status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {toast.show && (
          <Motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-10 right-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl glass border border-white/10 shadow-2xl"
          >
            <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
              <CheckCircle2 size={20} />
            </div>
            <p className="text-sm font-medium text-white">{toast.message}</p>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {modalConfig.show && (
          <div className="fixed inset-0 z-90 flex items-center justify-center p-6">
            <Motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModalConfig({ show: false, appId: null, status: null })}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm"
            />
            <Motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-700 p-8 rounded-4xl shadow-2xl"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${modalConfig.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {modalConfig.status === 'approved' ? <Check size={32} /> : <AlertCircle size={32} />}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 capitalize">{modalConfig.status} Application?</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                {modalConfig.status === 'approved' 
                  ? "This will create a mentor profile and send automated login credentials to the applicant's email address." 
                  : "Are you sure you want to reject this applicant? They will be moved to the rejected archive."}
              </p>
              <div className="flex gap-3">
                <button 
                  disabled={isUpdating}
                  onClick={() => setModalConfig({ show: false, appId: null, status: null })}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  disabled={isUpdating}
                  onClick={handleStatusUpdate}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                    modalConfig.status === 'approved' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20' : 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20'
                  }`}
                >
                  {isUpdating ? <Loader2 className="animate-spin" size={18} /> : "Confirm Action"}
                </button>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <UserCheck className="text-emerald-500" />
            Mentor Applications
          </h1>
          <p className="text-slate-400 text-sm">Review and verify expert applications for Acadara.</p>
        </div>
        
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button 
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                filter === status 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-500">
          <Loader2 className="animate-spin mb-4 text-blue-500" size={40} />
          <p className="font-medium">Fetching applications...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.length === 0 ? (
            <div className="text-center py-24 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
              <p className="text-slate-500 italic">No {filter} applications to display.</p>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.app_id} className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 hover:bg-slate-800/60 transition-all group shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left Side: Applicant Identity */}
                  <div className="flex gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center border border-blue-500/30">
                      <span className="text-xl font-black text-blue-400">
                        {app.full_name ? app.full_name.charAt(0) : '?'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{app.full_name}</h3>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          filter === 'pending' ? 'bg-amber-500/10 text-amber-400' : 
                          filter === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm flex items-center gap-2">
                        <Briefcase size={14} className="text-slate-500" /> {app.expertise}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <a href={`mailto:${app.email}`} className="text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1 transition-colors">
                          <Mail size={12} /> {app.email}
                        </a>
                        {app.linkedin_url && (
                          <a href={app.linkedin_url} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1 transition-colors">
                            <ExternalLink size={12} /> Social Url
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Action Buttons */}
                  <div className="flex gap-2 lg:border-l lg:border-slate-700 lg:pl-8">
                    {filter === 'pending' && (
                      <>
                        <button 
                          onClick={() => setModalConfig({ show: true, appId: app.app_id, status: 'approved' })}
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 rounded-xl text-sm font-bold hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                        >
                          <Check size={18} /> Approve
                        </button>
                        <button 
                          onClick={() => setModalConfig({ show: true, appId: app.app_id, status: 'rejected' })}
                          className="p-2.5 bg-slate-900 text-slate-500 border border-slate-700 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all active:scale-95"
                        >
                          <X size={20} />
                        </button>
                      </>
                    )}
                    
                  </div>
                </div>

                {/* Bottom Section: Mentorship Bio */}
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <div className="flex items-start gap-2 bg-slate-900/30 p-4 rounded-2xl">
                    <FileText size={16} className="text-slate-500 mt-1 shrink-0" />
                    <p className="text-xs text-slate-400 italic leading-relaxed">
                      "{app.mentorship_bio || "No biography provided."}"
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-[10px] text-slate-600 flex items-center gap-1 uppercase tracking-wider font-bold">
                      <Clock size={12} /> Applied on {new Date(app.applied_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}