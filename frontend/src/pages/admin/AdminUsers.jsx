import React, { useState, useEffect } from 'react';
import { adminService } from '../../core/api-services/admin.service';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserPlus, 
  ShieldCheck, 
  UserMinus, 
  Mail,
  GraduationCap,
  Briefcase,
  Loader2,
  UserCheck
} from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Create this endpoint in your adminService
      const res = await adminService.users(); 
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    const action = currentStatus === 'active' ? 'disable' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this account?`)) return;

    try {
      // Pass the new status to your backend
      await adminService.updateUserStatus(userId, currentStatus === 'active' ? 'disabled' : 'active');
      fetchUsers(); // Refresh list
    } catch (err) {
      alert("Failed to update user status", err);
    }
  };

  // Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.usr_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.usr_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All Roles" || user.usr_role.toLowerCase() === roleFilter.toLowerCase().slice(0, -1);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-blue-500" />
            User Management
          </h1>
          <p className="text-slate-400 text-sm">Manage, verify, and monitor Acadara community members.</p>
        </div>
        {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20">
          <UserPlus size={18} />
          Add New User
        </button> */}
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-800/40 border border-slate-700/50 rounded-2xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 appearance-none min-w-[140px]"
          >
            <option>All Roles</option>
            <option>Mentors</option>
            <option>Mentees</option>
            <option>Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/30 text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-6 py-5 font-semibold">User Details</th>
                <th className="px-6 py-5 font-semibold">Role</th>
                <th className="px-6 py-5 font-semibold">Status</th>
                <th className="px-6 py-5 font-semibold">Joined</th>
                <th className="px-6 py-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500" size={32} />
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.usr_id} className="hover:bg-slate-700/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 group-hover:border-blue-500/50 transition-colors">
                        <span className="text-xs font-bold text-slate-300">{user.usr_name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{user.usr_name}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Mail size={10} /> {user.usr_email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.usr_role === 'mentor' ? (
                        <Briefcase size={14} className="text-purple-400" />
                      ) : (
                        <GraduationCap size={14} className="text-blue-400" />
                      )}
                      <span className="text-sm text-slate-300 capitalize">{user.usr_role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                      user.usr_status === 'active' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {user.usr_status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleToggleStatus(user.usr_id, user.usr_status)}
                        className={`p-2 rounded-lg transition-all ${
                          user.usr_status === 'active' 
                          ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-400/10' 
                          : 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10'
                        }`}
                        title={user.usr_status === 'active' ? "Disable Account" : "Activate Account"}
                      >
                        {user.usr_status === 'active' ? <UserMinus size={18} /> : <UserCheck size={18} />}
                      </button>
                      <button className="p-2 text-slate-500 hover:text-white rounded-lg transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}