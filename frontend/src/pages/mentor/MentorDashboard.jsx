import { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
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

export default function MentorDashboard() {
  const { getMentorDashboard, loading } = useUserService();
  const [data, setData] = useState(null);

  useEffect(() => {
    const init = async () => {
      const res = await getMentorDashboard();
      if (res?.success) setData(res);
    };
    init();
  }, []);

  if (loading || !data) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-500 gap-4">
        <Loader2 className="animate-spin" size={40} />
        <p className="font-black uppercase tracking-widest text-xs">Loading Mentor Core...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            Mentor <span className="text-indigo-500">Core</span>
          </h1>
          <p className="text-slate-400 mt-2">
            You have {data.stats.pendingCount} students waiting for feedback.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Mentees" value={data.stats.totalMentees} color="bg-indigo-600" />
        <StatCard icon={Award} label="Mentor Rank" value={data.stats.mentorRank} color="bg-violet-600" />
        <StatCard icon={TrendingUp} label="Knowledge Points" value={data.stats.knowledgePoints} color="bg-emerald-500" />
        <StatCard icon={CheckCircle} label="Success Rate" value={data.stats.successRate} color="bg-sky-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Applications Quick View */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">New Applications</h2>
            <button 
              onClick={() => window.location.href='/mentor/mentee-requests'} 
              className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {data.pendingApplications.length > 0 ? (
              data.pendingApplications.map((app) => (
                <div key={app.match_id} className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] flex items-center justify-between group hover:border-indigo-500/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-white border border-slate-700">
                      {getInitials(app.Mentee?.user?.usr_name)}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{app.Mentee?.user?.usr_name}</p>
                      <p className="text-slate-500 text-[10px] uppercase font-black">Waiting for response</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-lg border border-indigo-500/20">
                    Pending
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 border-2 border-dashed border-slate-800 rounded-[2rem] text-center text-slate-500 text-xs italic">
                No new applications at the moment.
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed (Static for now, can be linked to Message logs later) */}
        <div className="space-y-6">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">System Logs</h2>
          <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between hover:bg-slate-900/50 transition-colors">
              <div className="flex items-center gap-4">
                <MessageSquare className="text-slate-500" size={18} />
                <p className="text-sm text-slate-300">Global chat connectivity <span className="text-emerald-500 font-bold uppercase text-[10px]">Active</span></p>
              </div>
            </div>
            <div className="p-6 border-b border-slate-800 flex items-center justify-between hover:bg-slate-900/50 transition-colors">
              <div className="flex items-center gap-4">
                <CheckCircle className="text-indigo-500" size={18} />
                <p className="text-sm text-slate-300">Semantic Matching Engine <span className="text-indigo-500 font-bold uppercase text-[10px]">Optimized</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}