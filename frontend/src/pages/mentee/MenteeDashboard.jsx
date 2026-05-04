import { useState, useEffect } from 'react';
import { BookOpen, Star, Zap, Target, ArrowRight, Calendar, Loader2 } from 'lucide-react';
import { useUserService } from '../../core/api-hooks/useUserService';
import { getInitials } from '../../utils/getInitials';

export const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2rem shadow-xl hover:border-indigo-500/30 transition-all group">
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon className="text-white" size={24} />
    </div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    <p className="text-3xl font-black text-white mt-1 italic tracking-tighter">{value}</p>
  </div>
);

export default function MenteeDashboard() {
  const { getDashboardStats, getMyRequests, loading } = useUserService();
  const [stats, setStats] = useState({
    activeGoals: 0,
    sessionsCompleted: 0,
    avgFeedback: 0
  });
  const [latestMatch, setLatestMatch] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch numeric stats
        const statsRes = await getDashboardStats();
        if (statsRes?.success) {
          setStats(statsRes.data);
        }

        // Fetch matches to show the "Active Journey"
        const matchesRes = await getMyRequests();
        if (matchesRes?.success && matchesRes.data.length > 0) {
          // Find the first 'accepted' match to display as the main journey
          const active = matchesRes.data.find(m => m.status === 'accepted');
          setLatestMatch(active || matchesRes.data[0]);
        }
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading && !stats.activeGoals) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-500 gap-4">
        <Loader2 className="animate-spin" size={40} />
        <p className="font-black uppercase tracking-widest text-xs">Synchronizing Command Center...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            Student <span className="text-indigo-500">Command</span>
          </h1>
          <p className="text-slate-400 mt-2">Ready to master a new skill today?</p>
        </div>
        <button 
          onClick={() => window.location.href='/mentee/find'} 
          className="px-8 py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-indigo-400 transition-all shadow-xl"
        >
          Find New Mentor
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Target} label="Active Goals" value={stats.activeGoals} color="bg-indigo-600" />
        <StatCard icon={Zap} label="Sessions Completed" value={stats.sessionsCompleted} color="bg-emerald-600" />
        <StatCard icon={Star} label="Avg. Feedback" value={stats.avgFeedback} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main: Active Mentorships */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Active Learning Journeys</h2>
          
          {latestMatch ? (
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-3xl font-black text-white border border-indigo-400/20 shadow-2xl">
                    {getInitials(latestMatch.Mentor?.user?.usr_name)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{latestMatch.Mentor?.user?.usr_name}</h3>
                    <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest">
                      {latestMatch.Mentor?.mentor_subject}
                    </p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Status</span>
                  <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${
                    latestMatch.status === 'accepted' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10' : 'text-amber-500 border-amber-500/20 bg-amber-500/10'
                  }`}>
                    {latestMatch.status}
                  </div>
                  <button 
                    onClick={() => window.location.href='/mentee/sessions'} 
                    className="mt-6 flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Open Workspace <ArrowRight size={14} />
                  </button>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity">
                <BookOpen size={200} />
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[3rem] p-16 text-center">
              <p className="text-slate-500 italic text-sm">No active mentorships found. Start matching to begin your journey!</p>
            </div>
          )}
        </div>

        {/* Sidebar: Upcoming Schedule */}
        <div className="space-y-6">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Next Steps</h2>
          <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl border border-slate-800 group hover:border-emerald-500/50 transition-colors cursor-pointer">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Calendar className="text-emerald-500" size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">View Schedule</p>
                <p className="text-slate-500 text-[10px] uppercase font-black">Check upcoming sessions</p>
              </div>
            </div>

            <div className="p-5 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Did you know?</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Consistent weekly sessions increase skill retention by **40%**. Keep going!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}