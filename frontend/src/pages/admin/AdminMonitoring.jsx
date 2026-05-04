import React from 'react';
import { 
  Server, 
  Cpu, 
  Database, 
  Globe, 
  Zap, 
  ShieldAlert, 
  RefreshCw,
  Search,
  Filter,
  Activity
} from "lucide-react";

export default function AdminMonitoring() {
  const services = [
    { name: "Frontend Cluster", status: "Operational", latency: "12ms", load: "24%", color: "text-emerald-400" },
    { name: "PHP Backend API", status: "Operational", latency: "48ms", load: "18%", color: "text-emerald-400" },
    { name: "OpenAI Semantic Engine", status: "Operational", latency: "840ms", load: "N/A", color: "text-emerald-400" },
    { name: "Main Database", status: "High Load", latency: "112ms", load: "88%", color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="text-blue-500" />
            System Monitoring
          </h1>
          <p className="text-slate-400 text-sm">Real-time infrastructure and API performance metrics.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-colors">
            System Report
          </button>
        </div>
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, i) => (
          <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-900 rounded-lg text-slate-400 group-hover:text-blue-400 transition-colors">
                <Server size={20} />
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-bold uppercase ${service.color}`}>● {service.status}</span>
                <span className="text-[10px] text-slate-500 font-mono">{service.latency}</span>
              </div>
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">{service.name}</h3>
            <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full ${service.load === 'N/A' ? 'bg-slate-700' : 'bg-blue-500'}`} 
                style={{ width: service.load === 'N/A' ? '100%' : service.load }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Resource Usage Graph Placeholder */}
        <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-white">Resource Utilization</h2>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-blue-400"><div className="w-2 h-2 rounded-full bg-blue-500" /> CPU</span>
              <span className="flex items-center gap-1.5 text-purple-400"><div className="w-2 h-2 rounded-full bg-purple-500" /> RAM</span>
            </div>
          </div>
          
          {/* Simulated Wave/Graph */}
          <div className="h-56 w-full flex items-center justify-center relative">
             <div className="absolute inset-0 flex items-center justify-between opacity-10 px-4">
                {[...Array(12)].map((_, i) => <div key={i} className="h-full w-px bg-slate-500" />)}
             </div>
             <div className="text-slate-600 text-xs font-mono uppercase tracking-[0.5em]">Live Telemetry Stream</div>
             {/* Replace with a charting library like Recharts or Chart.js for real data */}
          </div>
        </div>

        {/* Real-time Incident Log */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Error Log</h2>
          <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
            {[
              { code: 500, msg: "OpenAI Timeout", time: "19:04", severity: "high" },
              { code: 403, msg: "Auth Bypass Attempt", time: "18:55", severity: "med" },
              { code: 200, msg: "DB Snapshot Created", time: "18:30", severity: "low" },
              { code: 404, msg: "Missing Asset: /icon.png", time: "18:12", severity: "low" },
              { code: 500, msg: "PHP Thread Limit", time: "17:45", severity: "high" },
            ].map((log, i) => (
              <div key={i} className="p-3 bg-slate-900/50 border border-slate-700/30 rounded-xl flex items-center justify-between group hover:border-slate-600 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-8 rounded-full ${
                    log.severity === 'high' ? 'bg-rose-500' : log.severity === 'med' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div>
                    <p className="text-xs font-mono text-white">HTTP {log.code}</p>
                    <p className="text-[11px] text-slate-500 truncate w-32">{log.msg}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-600 font-bold">{log.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-2">
            Clear Logs
          </button>
        </div>
      </div>
    </div>
  );
}