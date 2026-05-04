import React from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  FileSpreadsheet, 
  FilePlus, 
  Search,
  MoreVertical,
  ChevronRight
} from "lucide-react";

export default function AdminReports() {
  const reportTemplates = [
    { title: "Monthly User Growth", type: "PDF / CSV", lastGen: "2 days ago", icon: FileText, color: "text-blue-400" },
    { title: "Mentor Matching Success", type: "PDF", lastGen: "1 week ago", icon: FileSpreadsheet, color: "text-purple-400" },
    { title: "System Performance Audit", type: "CSV", lastGen: "Yesterday", icon: FilePlus, color: "text-emerald-400" },
  ];

  const recentReports = [
    { name: "Q1_Mentorship_Overview.pdf", date: "Apr 15, 2026", size: "2.4 MB", status: "Ready" },
    { name: "User_Feedback_Summary_Mar.csv", date: "Apr 12, 2026", size: "840 KB", status: "Ready" },
    { name: "Semantic_Accuracy_Report_v2.pdf", date: "Apr 10, 2026", size: "1.2 MB", status: "Archived" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="text-violet-500" />
            Reports & Analytics
          </h1>
          <p className="text-slate-400 text-sm">Generate and export system data for academic review.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <select className="bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-300 appearance-none focus:outline-none focus:border-violet-500">
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-all">
            <FilePlus size={18} />
            Custom Report
          </button>
        </div>
      </div>

      {/* Quick Export Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTemplates.map((report, i) => (
          <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl hover:border-violet-500/50 transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-slate-900 ${report.color}`}>
                <report.icon size={24} />
              </div>
              <button className="p-2 text-slate-500 hover:text-white transition-colors">
                <Download size={20} />
              </button>
            </div>
            <h3 className="text-white font-bold mb-1">{report.title}</h3>
            <div className="flex justify-between items-center mt-4">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{report.type}</span>
              <span className="text-[10px] text-slate-600">Generated {report.lastGen}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Reports History Table */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Generated Reports History</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                type="text" 
                placeholder="Search files..." 
                className="bg-slate-900/50 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-violet-500"
              />
            </div>
            <button className="p-1.5 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-400 hover:text-white">
              <Filter size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/30 text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">File Name</th>
                <th className="px-6 py-4 font-semibold">Date Created</th>
                <th className="px-6 py-4 font-semibold">Size</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30 text-sm">
              {recentReports.map((file, i) => (
                <tr key={i} className="hover:bg-slate-700/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-900 rounded-lg text-violet-400 group-hover:scale-110 transition-transform">
                        <FileText size={16} />
                      </div>
                      <span className="text-slate-200 font-medium">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{file.date}</td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">{file.size}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      file.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {file.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <Download size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/20 flex justify-center">
          <button className="text-xs text-slate-500 hover:text-violet-400 flex items-center gap-1 font-semibold transition-colors">
            Show More Reports <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}