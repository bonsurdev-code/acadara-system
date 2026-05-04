import { useState, useEffect } from 'react';
import { 
  BookOpen, Save, Plus, Link, Sparkles, ChevronRight, 
  Calendar, MessageSquare, CheckCircle2, Rocket, Clock, Loader2 
} from 'lucide-react';
import { useUserService } from '../../core/api-hooks/useUserService';
import { useSession } from '../../core/api-hooks/useSessions';

export default function MentorSessions() {
  const { getReceivedRequests } = useUserService();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const res = await getReceivedRequests();
    if (res?.data) {
      // Logic: Only show matches that are 'accepted' AND 
      // (have no sessions yet OR the latest session is not 'completed')
      const activeWorkspaces = res.data.filter(m => {
        if (m.status !== 'accepted') return false;
        const latestSession = m.sessions?.[0];
        return !latestSession || latestSession.status !== 'completed';
      });
      setMatches(activeWorkspaces);
    }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  if (loading) return (
    <div className="p-20 flex justify-center items-center">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
    </div>
  );

  return (
    <div className="p-6 mx-auto space-y-10 max-w-6xl">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white italic tracking-tighter">
          MENTOR <span className="text-indigo-500">CONTROL</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Active Learning Workspaces</p>
      </header>
      
      <div className="space-y-10">
        {matches.map(match => (
          <MentorWorkspace key={match.match_id} match={match} onRefresh={fetch} />
        ))}
        {matches.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center justify-center bg-slate-900 border-2 border-dashed border-slate-800 rounded-[3rem]">
            <CheckCircle2 className="text-slate-700 mb-4" size={48} />
            <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">No active sessions to manage.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MentorWorkspace({ match, onRefresh }) {
  const { reviewSession } = useSession();
  const session = match.sessions?.[0]; // Get the current active session
  
  const [isTerminated, setIsTerminated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localData, setLocalData] = useState({
    is_date_agreed: false,
    is_event_agreed: true,
    study_goal: [],
    meeting_link: '',
    materials_note: ''
  });

  useEffect(() => {
    if (session) {
      let parsedGoals = [];
      try {
        parsedGoals = typeof session.study_goal === 'string' 
          ? JSON.parse(session.study_goal) 
          : (Array.isArray(session.study_goal) ? session.study_goal : []);
      } catch { parsedGoals = []; }

      setLocalData({
        is_date_agreed: session.is_date_agreed || false,
        is_event_agreed: true, 
        study_goal: parsedGoals,
        meeting_link: session.meeting_link || '',
        materials_note: session.materials_note || ''
      });
    }
  }, [session]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not proposed yet";
    return new Date(dateString).toLocaleDateString(undefined, { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const addTask = () => {
    setLocalData({ ...localData, study_goal: [...localData.study_goal, { id: Date.now(), text: '', completed: false }] });
  };

  const updateTask = (id, text) => {
    setLocalData({ ...localData, study_goal: localData.study_goal.map(t => t.id === id ? { ...t, text } : t) });
  };

  const toggleTask = (id) => {
    setLocalData({ ...localData, study_goal: localData.study_goal.map(t => t.id === id ? { ...t, completed: !t.completed } : t) });
  };

  const handleSync = async (status = session?.status) => {
    setIsSubmitting(true);
    // If we approve the date during negotiation, move to 'confirmed'
    const finalStatus = (status === 'negotiating' && localData.is_date_agreed) ? 'confirmed' : status;
    
    const res = await reviewSession(session.session_id, { ...localData, status: finalStatus });
    
    if (res?.success) {
      if (status === 'completed') {
        setIsTerminated(true);
        setTimeout(() => onRefresh(), 2000);
      } else {
        onRefresh();
      }
    }
    setIsSubmitting(false);
  };

  if (isTerminated) {
    return (
      <div className="bg-slate-900 border border-emerald-500/30 rounded-[2.5rem] p-12 text-center shadow-2xl animate-in zoom-in-95">
        <CheckCircle2 className="text-emerald-500 mx-auto mb-4" size={48} />
        <h3 className="text-white font-black text-xl italic uppercase tracking-tighter">Mission Complete</h3>
        <p className="text-slate-500 text-sm mt-2 font-medium">Session data archived. Great work, Mentor!</p>
      </div>
    );
  }

  // State: Match exists but Mentee hasn't proposed a session yet
  if (!session) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
            <Clock size={40} className="animate-pulse" />
        </div>
        <div>
            <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic">Awaiting Proposal</h3>
            <p className="text-slate-400 max-w-md mx-auto mt-2">
              You are matched with <span className="text-indigo-400 font-bold">{match.Mentee.user.usr_name}</span>. 
              We're waiting for them to propose a session date and agenda.
            </p>
        </div>
      </div>
    );
  }

  const progress = localData.study_goal.length > 0 
    ? Math.round((localData.study_goal.filter(t => t.completed).length / localData.study_goal.length) * 100) 
    : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-slate-700">
      <div className="p-8 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-linear-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg">
            {match.Mentee.user.usr_name[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{match.Mentee.user.usr_name}</h3>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
              <Sparkles size={12}/> {match.Mentee.mentee_subject}
            </div>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-500 px-4 py-1.5 rounded-full border border-indigo-500/20">
          Status: {session.status}
        </span>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Calendar size={12}/> Requested Schedule
            </p>
            <p className="text-sm text-white font-medium">{formatDate(session.requested_date)}</p>
          </div>
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
              <MessageSquare size={12}/> Mentee's Objectives
            </p>
            <p className="text-sm text-slate-300 italic">"{session.mentee_agenda || 'No agenda provided'}"</p>
          </div>
        </div>

        {session.status === 'negotiating' ? (
          <div className="space-y-6 animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Verify Details</h4>
              <button 
                onClick={() => setLocalData({...localData, is_date_agreed: !localData.is_date_agreed})} 
                className={`w-full py-4 rounded-2xl border-2 font-black text-xs transition-all uppercase tracking-widest flex items-center justify-center gap-2 ${
                  localData.is_date_agreed ? 'bg-emerald-600 border-emerald-500 text-white' : 'text-slate-500 border-slate-800 hover:border-slate-700'
                }`}
              >
                {localData.is_date_agreed ? <CheckCircle2 size={16}/> : null}
                {localData.is_date_agreed ? 'Schedule Approved' : 'Approve Proposed Date'}
              </button>
            </div>
            <button 
              onClick={() => handleSync('confirmed')} 
              disabled={!localData.is_date_agreed || isSubmitting}
              className="w-full py-5 bg-white text-black disabled:bg-slate-800 disabled:text-slate-600 font-black rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs shadow-xl"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : 'CONFIRM & OPEN WORKSPACE'} <ChevronRight size={18}/>
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Live Workspace Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16}/>
                <input value={localData.meeting_link} onChange={(e) => setLocalData({...localData, meeting_link: e.target.value})} placeholder="Meeting Link (Zoom/Google Meet)" className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl text-white text-sm outline-none focus:border-indigo-500" />
              </div>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16}/>
                <input value={localData.materials_note} onChange={(e) => setLocalData({...localData, materials_note: e.target.value})} placeholder="Shared Resources Link" className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl text-white text-sm outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-[2rem] border border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Session Roadmap</span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-black tracking-tighter">{progress}%</span>
                  <button onClick={addTask} className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"><Plus size={16}/></button>
                </div>
              </div>
              <div className="space-y-3">
                {localData.study_goal.map(t => (
                  <div key={t.id} className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <input type="checkbox" checked={t.completed} onChange={() => toggleTask(t.id)} className="w-5 h-5 accent-emerald-500 rounded-lg cursor-pointer" />
                    <input value={t.text} onChange={(e) => updateTask(t.id, e.target.value)} className={`bg-transparent border-none text-sm outline-none flex-1 ${t.completed ? 'text-slate-600 line-through font-medium' : 'text-slate-200'}`} placeholder="Define a milestone..." />
                  </div>
                ))}
                {localData.study_goal.length === 0 && <p className="text-xs text-slate-600 italic text-center py-4">No tasks added to the roadmap yet.</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => handleSync()} 
                disabled={isSubmitting}
                className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-700 transition-all uppercase tracking-widest text-[10px]"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} SYNC PROGRESS
              </button>
              <button 
                onClick={() => handleSync('completed')} 
                disabled={isSubmitting}
                className="px-6 py-4 bg-red-600/10 text-red-500 border border-red-500/20 font-bold rounded-2xl hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest text-[10px]"
              >
                FINISH SESSION
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}