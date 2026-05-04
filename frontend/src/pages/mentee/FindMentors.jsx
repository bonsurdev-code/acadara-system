import { useState } from 'react';
import { Sparkles, Search, Calendar, BrainCircuit, Send, X, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../core/api-hooks/useAuth';
import { useUserService } from '../../core/api-hooks/useUserService';
import { getInitials } from '../../utils/getInitials';
import { useNavigate } from 'react-router-dom';

export default function FindMentors() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getRecommendations, loading: isMatching, createMentorshipRequest } = useUserService();
  const [mentors, setMentors] = useState([]);
  const [hasMatched, setHasMatched] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // --- 1. HANDLE REQUESTED STATE ---
  if (user?.hasRequested) {
    return (
      <div className="p-5 max-w-7xl mx-auto min-h-[60vh] flex items-center justify-center">
        <div className="relative group max-w-2xl w-full">
          <div className="absolute -inset-1 bg-linear-to-r from-amber-600 to-orange-600 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative bg-slate-900/80 border border-slate-800 rounded-3xl p-12 flex flex-col items-center text-center space-y-6 backdrop-blur-xl">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Clock className="text-amber-500 animate-pulse" size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">Request Pending</h2>
              <p className="text-slate-400 text-lg">
                You've already sent a request to a mentor. Please wait for their response before running the AI matching again.
              </p>
            </div>
            <div className="pt-4 flex gap-4">
              <button 
                onClick={() => navigate('/mentee/requests')}
                className="px-6 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-all">
                View My Requests
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. HANDLE ALREADY MATCHED STATE ---
  if (user?.isMatched) {
    return (
      <div className="p-5 max-w-7xl mx-auto min-h-[60vh] flex items-center justify-center">
        <div className="relative group max-w-2xl w-full">
          <div className="absolute -inset-1 bg-linear-to-r from-emerald-600 to-teal-600 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative bg-slate-900/80 border border-slate-800 rounded-3xl p-12 flex flex-col items-center text-center space-y-6 backdrop-blur-xl">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="text-emerald-500" size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">You're All Set!</h2>
              <p className="text-slate-400 text-lg">
                You are currently matched with a mentor. Head over to your dashboard to start your sessions.
              </p>
            </div>
            <button className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20">
              Go to Workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. THE NORMAL MATCHING FLOW ---
  const handleStartMatching = async () => {
    try {
      const payload = {
        subject: user?.subject,
        description: user?.description,
        lvl: user?.lvl,
        availability: user?.availability 
      };
      const results = await getRecommendations(payload);
      setMentors(results);
      setHasMatched(true);
    } catch (err) {
      console.error("Matching error:", err);
    }
  };

  const handleConfirmRequest = async () => {
    try {
      await createMentorshipRequest(selectedMatch);
      setSelectedMatch(null);
      window.location.reload(); 
    } catch (err) {
      console.error("Request failed:", err);
    }
  };

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Find Your <span className="text-emerald-500">Perfect Match</span>
          </h1>
          <p className="text-slate-400 mt-2 max-w-lg">
            Our AI analyzes your goals in <span className="text-slate-200 font-semibold">{user?.subject || 'your subject'}</span>.
          </p>
        </div>
        
        <div className="flex gap-3 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
          <div className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2">
            <BrainCircuit size={14} className="text-emerald-500" />
            {user?.lvl || 'Beginner'}
          </div>
        </div>
      </div>

      {!hasMatched ? (
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-emerald-600 to-teal-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-slate-900/80 border border-slate-800 rounded-3xl p-12 flex flex-col items-center text-center space-y-6 backdrop-blur-xl">
            <div className={`w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 ${isMatching ? 'animate-pulse' : ''}`}>
              <Sparkles className={`text-emerald-500 ${isMatching ? 'animate-spin-slow' : ''}`} size={40} />
            </div>
            <div className="max-w-md">
              <h2 className="text-2xl font-bold text-white">Ready to begin?</h2>
              <p className="text-slate-400 mt-2">Run the semantic matching engine against active mentors.</p>
            </div>
            <button 
              onClick={handleStartMatching}
              disabled={isMatching}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-900/20 flex items-center gap-3"
            >
              {isMatching ? 'Analyzing Semantics...' : 'Find My Mentors'}
              {!isMatching && <Search size={20} />}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {mentors.map((match) => (
            <MentorCard key={match.mentor_id} match={match} onRequest={() => setSelectedMatch(match)}/>
          ))}
        </div>
      )}

      {/* --- MENTORSHIP REQUEST MODAL --- */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <Sparkles className="text-emerald-500" size={24} />
              </div>
              <button onClick={() => setSelectedMatch(null)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Request Mentorship?</h2>
              <p className="text-slate-400 text-sm">
                You are requesting a match with <span className="text-white font-semibold">{selectedMatch.Mentor?.user?.usr_name}</span>. 
                They have a <span className="text-emerald-500 font-bold">{selectedMatch.similarity_score}%</span> match rate for your goals.
              </p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Subject:</span>
                <span className="text-slate-300">{selectedMatch.Mentor?.mentor_subject}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Your Goal:</span>
                <span className="text-slate-300 truncate max-w-150px">{user?.description}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setSelectedMatch(null)}
                className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmRequest}
                className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all"
              >
                Confirm Request <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function MentorCard({ match , onRequest }) {
  // Extracting data from the match object (populated via your Sequelize include)
  const mentor = match.Mentor;
  const userData = mentor?.user;
  const score = (match.similarity_score * 100).toFixed(1);

  return (
    <div className="group bg-slate-900/40 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
          {getInitials(userData?.usr_name) || "MT"}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Match Score</span>
          <span className="text-lg font-black text-white">{score}%</span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-white">{userData?.usr_name || 'Mentor Name'}</h3>
      <p className="text-sm text-slate-400 line-clamp-2 mt-1 min-h-40px">
        {mentor?.mentor_topics || 'No topics listed'}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-slate-800 rounded-md text-[10px] text-slate-300 font-medium">
          {mentor?.mentor_experience || '0 yrs'} Exp.
        </span>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500">
          <Calendar size={14} />
          <span className="text-xs">Availability Set</span>
        </div>
        <button 
          onClick={onRequest} // Call the modal opener
          className="flex items-center gap-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors group/btn"
        >
          Request Mentorship <Send size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}