import { useState, useEffect } from 'react';
import { BrainCircuit, MessageSquare, History, UserCheck, ExternalLink } from 'lucide-react';
import { useUserService } from '../../core/api-hooks/useUserService';
import { getInitials } from '../../utils/getInitials';

export default function MenteeRequests() {
  const { getReceivedRequests, updateRequestStatus, loading } = useUserService();
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState('');

  const fetch = async () => {
    const res = await getReceivedRequests();
    if (res?.data) {
      // Pending or Accepted requests stay in the active view
      setRequests(res.data.filter(r => r.status !== 'expired' && r.status !== 'rejected'));
      // History shows expired or rejected requests
      setHistory(res.data.filter(r => r.status === 'expired' || r.status === 'rejected'));
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleAction = async (id, status, metadata = {}) => {
    await updateRequestStatus(id, { status: status, match_metadata: metadata });
    await fetch(); // Refresh both lists
    setRejectingId(null);
    setReason('');
  };

  if (loading) return <div className="p-10 text-slate-500 animate-pulse">Syncing applications...</div>;

  return (
    <div className="p-5 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Mentorship <span className="text-indigo-500">Hub</span></h1>
          <p className="text-slate-400 mt-1">Manage incoming requests and your alumni network.</p>
        </div>
        <div className="hidden md:flex bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl items-center gap-2">
          <BrainCircuit size={18} className="text-indigo-500" />
          <span className="text-xs font-bold text-slate-300">{requests.filter(r => r.status === 'pending').length} New Requests</span>
        </div>
      </div>

      {/* ACTIVE APPLICATIONS */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <UserCheck size={18} className="text-indigo-500" />
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Active Requests & Reviews</h2>
        </div>
        <div className="grid gap-6">
          {requests.length === 0 ? (
            <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[2.5rem] p-20 text-center">
              <p className="text-slate-600 font-medium italic">Your inbox is currently clear.</p>
            </div>
          ) : (
            requests.map((req) => (
              <RequestCard 
                key={req.match_id} 
                req={req} 
                onAction={handleAction} 
                rejecting={{rejectingId, setRejectingId, reason, setReason}} 
              />
            ))
          )}
        </div>
      </section>

      {/* COMPLETED/REJECTED HISTORY */}
      {history.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-slate-800/50">
          <div className="flex items-center gap-2">
            <History size={18} className="text-slate-500" />
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Past Activity</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((item) => (
              <div key={item.match_id} className="bg-slate-900/20 border border-slate-800/60 p-5 rounded-3xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-500 border border-slate-700">
                  {getInitials(item.Mentee?.user?.usr_name)}
                </div>
                <div className="flex-1">
                   <h4 className="text-white font-bold text-sm">{item.Mentee?.user?.usr_name}</h4>
                   <p className="text-[10px] text-slate-500 uppercase font-black">{item.Mentee?.mentee_subject}</p>
                </div>
                <div className="text-right">
                   <p className={`text-[10px] font-black uppercase italic ${item.status === 'rejected' ? 'text-red-400' : 'text-indigo-400'}`}>
                    {item.status}
                   </p>
                   <p className="text-[9px] text-slate-600 mt-0.5">{new Date(item.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function RequestCard({ req, onAction, rejecting }) {
  const { rejectingId, setRejectingId, reason, setReason } = rejecting;
  const isAccepted = req.status === 'accepted';

  return (
    <div className={`bg-slate-900/50 border rounded-[2.5rem] p-8 transition-all group shadow-xl ${isAccepted ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-800 hover:border-indigo-500/30'}`}>
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Profile Section */}
        <div className="lg:w-1/4 space-y-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg ${isAccepted ? 'bg-emerald-500' : 'bg-indigo-600'}`}>
              {getInitials(req.Mentee?.user?.usr_name)}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{req.Mentee?.user?.usr_name}</h3>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{req.Mentee?.mentee_lvl}</p>
            </div>
          </div>
          <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Semantic Match</p>
             <p className="text-2xl font-black text-white">{(req.similarity_score * 100).toFixed(1)}%</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-4 w-full">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={12} /> Desired Outcome
            </label>
            <div className="bg-slate-800/30 p-5 rounded-2xl text-sm text-slate-300 leading-relaxed italic border border-slate-800/50">
              "{req.text_embedded.split('Goal:')[1] || req.text_embedded}"
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="lg:w-1/5 flex flex-col justify-center gap-3 w-full">
          {isAccepted ? (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="text-center">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">Request Accepted</p>
               </div>
               <button 
                onClick={() => window.location.href = '/mentor/sessions'}
                className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-900/20"
               >
                Go to Workspace <ExternalLink size={14} />
               </button>
            </div>
          ) : rejectingId === req.match_id ? (
            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
              <textarea 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-red-500/50 resize-none"
                placeholder="Why is this not a fit?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={() => onAction(req.match_id, 'rejected', { rejection_reason: reason })} className="flex-1 py-2 bg-red-600 text-white text-[10px] font-black rounded-lg uppercase">Confirm</button>
                <button onClick={() => setRejectingId(null)} className="flex-1 py-2 bg-slate-800 text-slate-400 text-[10px] font-black rounded-lg uppercase tracking-tighter">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={() => onAction(req.match_id, 'accepted')}
                className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-400 transition-all uppercase tracking-widest text-[10px] shadow-xl"
              >
                Accept Mentee
              </button>
              <button 
                onClick={() => setRejectingId(req.match_id)}
                className="w-full py-4 bg-slate-800 text-slate-500 font-black rounded-2xl flex items-center justify-center gap-2 hover:text-red-400 transition-all uppercase tracking-widest text-[10px]"
              >
                Decline
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}