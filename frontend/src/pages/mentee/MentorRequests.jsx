import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, MessageSquare, ArrowRight, History, Archive } from 'lucide-react';
import { useUserService } from '../../core/api-hooks/useUserService';
import { getInitials } from '../../utils/getInitials';

export default function MentorRequests() {
  const { getMyRequests, loading } = useUserService();
  const [activeRequests, setActiveRequests] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getMyRequests();
        if (response && response.data) {
          // Filter data based on status
          setActiveRequests(response.data.filter(r => r.status !== 'expired'));
          setHistory(response.data.filter(r => r.status === 'expired'));
        }
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <div className="p-10 text-slate-500 animate-pulse">Loading your requests...</div>;

  return (
    <div className="p-5 max-w-5xl mx-auto space-y-12">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">My <span className="text-emerald-500">Mentorships</span></h1>
        <p className="text-slate-400 mt-2">Track your current applications and view your learning history.</p>
      </div>

      {/* Active Requests Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-emerald-500" />
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Active Applications</h2>
        </div>
        <div className="grid gap-4">
          {activeRequests.length === 0 ? (
            <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-12 text-center">
              <p className="text-slate-600 text-sm italic">No active requests found.</p>
            </div>
          ) : (
            activeRequests.map((req) => <RequestCard key={req.match_id} request={req} />)
          )}
        </div>
      </section>

      {/* History Section */}
      {history.length > 0 && (
        <section className="space-y-4 pt-8 border-t border-slate-800/50">
          <div className="flex items-center gap-2 mb-4">
              <History size={18} className="text-indigo-500" />
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Mentorship History</h2>
          </div>
          <div className="grid gap-4 opacity-70 hover:opacity-100 transition-opacity">
            {history.map((req) => <RequestCard key={req.match_id} request={req} isHistory={true} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function RequestCard({ request, isHistory = false }) {
  const mentor = request.Mentor;
  const userData = mentor?.user;
  
  const statusStyles = {
    pending: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-500', icon: <Clock size={16} />, label: 'Pending' },
    accepted: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-500', icon: <CheckCircle2 size={16} />, label: 'Active' },
    rejected: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-500', icon: <XCircle size={16} />, label: 'Declined' },
    expired: { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-400', icon: <Archive size={16} />, label: 'Completed' }
  };

  const currentStatus = statusStyles[request.status] || statusStyles.pending;

  return (
    <div className={`relative group overflow-hidden bg-slate-900/40 border ${currentStatus.border} rounded-3xl p-6 transition-all ${isHistory ? 'grayscale-[0.5]' : ''}`}>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        
        <div className="flex items-center gap-4 min-w-[200px]">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white border transition-colors ${isHistory ? 'bg-slate-800 border-slate-700' : 'bg-indigo-600 border-indigo-400/20 shadow-lg shadow-indigo-900/20'}`}>
            {getInitials(userData?.usr_name)}
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{userData?.usr_name}</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{mentor?.mentor_subject}</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-slate-950/50 p-3 px-4 rounded-2xl border border-slate-800/50">
            <p className="text-[9px] text-slate-600 uppercase font-black tracking-tighter mb-1">Context</p>
            <p className="text-xs text-slate-400 italic line-clamp-1">"{request.text_embedded}"</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${currentStatus.bg} ${currentStatus.text}`}>
            {currentStatus.icon}
            {currentStatus.label}
          </div>
          
          {!isHistory && request.status === 'accepted' && (
            <button 
              onClick={() => window.location.href='/mentee/sessions'}
              className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 transition-all flex items-center gap-2"
            >
              Enter Room <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}