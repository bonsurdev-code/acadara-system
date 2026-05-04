import React, { useEffect, useState } from 'react';
import { 
  Users, BrainCircuit, Activity, AlertCircle, 
  ArrowUpRight, CheckCircle2, Clock, Loader2 
} from "lucide-react";
import { useAdmin } from '../../core/api-hooks/useAdmin';

export default function AdminDashboard() {
  const { getStats, loading } = useAdmin();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getStats();
      if (res?.success) {
        setDashboardData(res.data);
      }
    };
    fetchData();
  }, [getStats]);

  if (loading || !dashboardData) {
    return (
      <div className="h-full w-full flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  const { stats, recentMatches } = dashboardData;

  // Map Backend data to the UI Stats Cards
  const statCards = [
    { label: "Total Mentors", value: stats.totalMentors, growth: "+14%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "AI Matches", value: stats.totalMatches, growth: "+22%", icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Success Rate", value: `${stats.successRate}%`, growth: "Stable", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending Issues", value: stats.pendingIssues, growth: "Live", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">System Overview</h1>
        <p className="text-slate-400 text-sm">Real-time analytics for Acadara's mentorship network.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-slate-900/50 text-emerald-400">
                {stat.growth}
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Analytics Visualization */}
        <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-lg font-bold text-white">Semantic Match Distribution</h2>
              <p className="text-sm text-slate-400">Pairing accuracy across departments</p>
            </div>
            <button className="text-blue-400 text-xs font-semibold flex items-center gap-1 hover:underline">
              Detailed Analytics <ArrowUpRight size={14} />
            </button>
          </div>
          
          <div className="flex items-end justify-between h-48 gap-4 px-2">
            {[65, 45, 85, 30, 95, 55, 75].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div 
                  className="w-full bg-linear-to-t from-blue-600/20 to-indigo-500 rounded-lg transition-all duration-500 group-hover:to-violet-500"
                  style={{ height: `${val}%` }}
                ></div>
                <span className="text-[10px] text-slate-500 font-mono">D-{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Activity Feed */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8">
          <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {recentMatches?.map((match, i) => (
              <div key={match.match_id || i} className="flex gap-4 items-start">
                <div className="mt-1 p-2 rounded-lg bg-slate-900 text-purple-400">
                  <BrainCircuit size={16} />
                </div>
                <div>
                  <p className="text-sm text-slate-200">
                    <span className="font-bold text-white">{match.Mentor?.user?.usr_name}</span> 
                    <span className="text-slate-400"> matched with </span> 
                    <span className="font-bold text-white">{match.Mentee?.user?.usr_name}</span>
                  </p>
                  <span className="text-[10px] text-slate-500 uppercase tracking-tighter">
                    {new Date(match.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • New Match
                  </span>
                </div>
              </div>
            ))}
            
            {recentMatches?.length === 0 && (
                <p className="text-slate-500 text-sm italic py-10 text-center">No recent match activity found.</p>
            )}

            <button className="w-full mt-4 py-3 border border-slate-700 hover:bg-slate-700/50 rounded-xl text-sm font-semibold transition-all">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}