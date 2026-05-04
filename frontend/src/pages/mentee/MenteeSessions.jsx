import { useState, useEffect } from 'react';
import { 
  Clock, Video, BookOpen, Sparkles, Check, Star, 
  ListChecks, Calendar, Layout, Loader2, ArrowRight
} from 'lucide-react';
import { useUserService } from '../../core/api-hooks/useUserService';
import { useSession } from '../../core/api-hooks/useSessions';
import { getInitials } from '../../utils/getInitials';

export default function MenteeSessions() {
  const { getMyRequests, submitRating, unmatchPartners } = useUserService();
  const { proposeSession, getActiveSession } = useSession();
  
  const [activeMatch, setActiveMatch] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [formData, setFormData] = useState({ date: '', agenda: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const init = async () => {
    try {
      const res = await getMyRequests();
      // Look for the accepted mentorship
      const accepted = res?.data?.find(m => m.status === 'accepted');
      
      if (accepted) {
        setActiveMatch(accepted);
        const sessionRes = await getActiveSession(accepted.match_id);
        
        if (sessionRes?.data) {
          setCurrentSession(sessionRes.data);
          // Auto-trigger modal if the mentor marked it as completed
          if (sessionRes.data.status === 'completed') {
            setShowRatingModal(true);
          }
        }
      } else {
        setActiveMatch(null);
        setCurrentSession(null);
      }
    } catch (err) {
      console.error("Initialization error:", err);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleSendProposal = async () => {
    if (!formData.date || !formData.agenda) return alert("Please fill in all fields.");
    setIsSubmitting(true);
    const res = await proposeSession({
      match_id: activeMatch.match_id,
      requested_date: formData.date,
      meeting_event: 'online',
      mentee_agenda: formData.agenda
    });
    if (res?.success) await init();
    setIsSubmitting(false);
  };

  const handleRatingAndCleanup = async (ratingData) => {
    const res = await submitRating(ratingData);
    if (res?.success) {
      // Logic to delete the match record so the mentee can find someone else
      await unmatchPartners(activeMatch.match_id);
      setShowRatingModal(false);
      window.location.reload().then(() => {window.location.href = "/mentee/dashboard"}) 
    }
  };

  // State: No Mentorship Found
  if (!activeMatch) return (
    <div className="p-20 text-center flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-slate-900 border border-slate-800 p-12 rounded-[3rem] shadow-2xl max-w-md">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Layout className="text-slate-500" size={32} />
        </div>
        <h2 className="text-white font-black text-2xl italic uppercase tracking-tighter">No Active Goals</h2>
        <p className="text-slate-500 text-sm mt-3 mb-8">You don't have an active mentor right now. Start a new learning journey today.</p>
        <button 
          onClick={() => window.location.href = '/mentee/find'}
          className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
        >
          Explore Mentors <ArrowRight size={14}/>
        </button>
      </div>
    </div>
  );

  // Parse Roadmap Tasks
  let tasks = [];
  try {
    tasks = typeof currentSession?.study_goal === 'string' 
      ? JSON.parse(currentSession.study_goal) 
      : (currentSession?.study_goal || []);
  } catch { tasks = []; }

  const progress = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) 
    : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
      
      {/* RATING MODAL (Portal-style overlay) */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <RatingModal 
            session={currentSession} 
            mentorName={activeMatch.Mentor.user.usr_name}
            onConfirm={handleRatingAndCleanup} 
          />
        </div>
      )}

      {/* SIDEBAR: Mentor Identity */}
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="relative">
                <div className="w-24 h-24 rounded-[2rem] bg-linear-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-3xl font-black text-white shadow-2xl uppercase">
                {getInitials(activeMatch.Mentor.user.usr_name)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl border-4 border-slate-900">
                    <Check className="text-slate-900" size={16} strokeWidth={4} />
                </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">{activeMatch.Mentor.user.usr_name}</h2>
              <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                <Sparkles size={12} className="text-indigo-400" />
                <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{activeMatch.Mentor.mentor_subject}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE AREA */}
      <div className="lg:col-span-2">
        {currentSession?.status === 'confirmed' ? (
          /* STATE 1: LIVE WORKSPACE */
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Phase: Execution</span>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mt-1">Learning Roadmap</h1>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-black text-emerald-500 tracking-tighter">{progress}%</span>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Completed</p>
                  </div>
                </div>

                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5 mb-10">
                  <div 
                    className="bg-linear-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>

                <div className="grid gap-3">
                  {tasks.length > 0 ? tasks.map((task, i) => (
                    <div key={i} className={`flex items-center gap-5 p-5 rounded-2xl border transition-all ${task.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-950 border-slate-800 shadow-inner'}`}>
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-800 bg-slate-900'}`}>
                        {task.completed && <Check size={14} className="text-slate-900 font-black" strokeWidth={4} />}
                      </div>
                      <span className={`text-sm font-bold ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {task.text}
                      </span>
                    </div>
                  )) : (
                    <div className="text-center py-10 opacity-30 italic text-sm text-slate-400">Roadmap is being generated by your mentor...</div>
                  )}
                </div>
              </div>
              <Sparkles size={180} className="absolute -right-10 -bottom-10 opacity-[0.03] rotate-12" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href={currentSession.meeting_link} target="_blank" rel="noreferrer" className="group flex flex-col items-center justify-center p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] hover:border-emerald-500/50 transition-all shadow-xl">
                <Video className="text-emerald-500 mb-3 group-hover:scale-110 transition-transform" size={32} />
                <span className="text-white font-black text-[10px] uppercase tracking-widest">Virtual Meeting</span>
                <span className="text-slate-500 text-[10px] mt-1 italic">Click to join call</span>
              </a>
              <a href={currentSession.materials_note} target="_blank" rel="noreferrer" className="group flex flex-col items-center justify-center p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] hover:border-indigo-500/50 transition-all shadow-xl">
                <BookOpen className="text-indigo-500 mb-3 group-hover:scale-110 transition-transform" size={32} />
                <span className="text-white font-black text-[10px] uppercase tracking-widest">Resource Vault</span>
                <span className="text-slate-500 text-[10px] mt-1 italic">Access study files</span>
              </a>
            </div>
          </div>
        ) : (
          /* STATE 2: PLANNER / NEGOTIATING */
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 shadow-2xl">
            <header className="mb-12">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Phase: Initiation</span>
              <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mt-1">Session <span className="text-indigo-500">Planner</span></h2>
            </header>

            {currentSession?.status === 'negotiating' ? (
              <div className="text-center py-16 bg-slate-950 rounded-[2.5rem] border border-slate-800/50 animate-pulse">
                <Clock className="text-indigo-500 mx-auto mb-6" size={56} />
                <p className="text-white font-bold text-lg italic uppercase tracking-tight">Reviewing Proposal...</p>
                <p className="text-slate-500 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
                  Your mentor is checking their schedule for {new Date(currentSession.requested_date).toLocaleDateString()}.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-2">
                    <Calendar size={14}/> Preferred Schedule
                  </label>
                  <input 
                    type="datetime-local" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white outline-none focus:border-indigo-500 transition-all" 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-2">
                    <ListChecks size={14}/> Learning Objectives
                  </label>
                  <textarea 
                    placeholder="Describe what specific topics or problems you want to solve in this session..." 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white min-h-[160px] outline-none focus:border-indigo-500 transition-all resize-none" 
                    onChange={(e) => setFormData({...formData, agenda: e.target.value})} 
                  />
                </div>
                <button 
                  onClick={handleSendProposal} 
                  disabled={isSubmitting}
                  className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-indigo-400 transition-all shadow-xl uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : 'Send Proposal to Mentor'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * COMPONENT: RatingModal
 */
function RatingModal({ session, mentorName, onConfirm }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async () => {
    if (score === 0) return;
    setIsSubmitting(true);
    await onConfirm({ 
      session_id: session.session_id, 
      rating: score, 
      comment: comment 
    });
    setIsSubmitting(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] text-center shadow-2xl relative max-w-md w-full animate-in zoom-in-95 duration-300">
      <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-indigo-600 to-emerald-500" />
      
      <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
        <Star className="text-emerald-500" size={40} fill="currentColor" />
      </div>
      
      <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Mission Complete</h2>
      <p className="text-slate-400 mt-4 mb-10 text-sm leading-relaxed">
        Great work! How was your session with <span className="text-white font-bold">{mentorName}</span>?
      </p>

      <div className="flex justify-center gap-3 mb-10">
        {[1, 2, 3, 4, 5].map(s => (
          <Star 
            key={s} 
            size={42}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setScore(s)} 
            className={`cursor-pointer transition-all hover:scale-110 ${(hover || score) >= s ? 'text-yellow-400' : 'text-slate-800'}`} 
            fill={(hover || score) >= s ? 'currentColor' : 'none'} 
          />
        ))}
      </div>

      <textarea 
        placeholder="Share a testimonial (optional)..." 
        className="w-full bg-slate-950 border border-slate-800 rounded-[1.5rem] p-5 text-white outline-none focus:border-indigo-500 transition-all min-h-[120px] mb-8 text-sm resize-none" 
        onChange={(e) => setComment(e.target.value)} 
      />

      <button 
        onClick={handleAction}
        disabled={isSubmitting || score === 0}
        className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-emerald-400 transition-all uppercase tracking-widest text-[11px] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : 'Finish & Find New Mentor'}
      </button>
    </div>
  );
}