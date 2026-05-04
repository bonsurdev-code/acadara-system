import { useState } from 'react';
import { Save, CheckCircle2, Book, Calendar, Star } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../assets/datepicker-custom.css';

import BaseModal from './BaseModal';
import { getInitials } from '../utils/getInitials';
import { formatToPostgresRange, parsePostgresRange } from '../utils/dateUtils';
import { useAuth } from '../core/api-hooks/useAuth';
import { useUserService } from '../core/api-hooks/useUserService';

export default function ProfileModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { updateProfile, loading: isSaving } = useUserService();
  
  // 1. Theme Configuration
  const isMentor = user?.usr_role === 'mentor';
  const themeColor = isMentor ? 'indigo' : 'emerald';
  const accentClass = isMentor ? 'border-indigo-500/50' : 'border-emerald-500/50';

  // 2. State Initialization (Prevents Cascading Renders)
  // const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState(() => ({
    subject: user?.subject || '',
    description: user?.description || '',
    topics: user?.topics || '',
    experience: user?.experience || '',
    lvl: user?.lvl || 'beginner',
  }));

  const [dateRange, setDateRange] = useState(() => {
    const { start, end } = parsePostgresRange(user?.availability);
    return [start, end];
  });
  
  const [startDate, endDate] = dateRange;

  // 3. Handlers
  const handleSave = async () => {
    try {
      const postgresRange = formatToPostgresRange(startDate, endDate);
      
      // Create an object with all current form values
      const currentData = {
        subject: formData.subject,
        [isMentor ? 'topics' : 'description']: isMentor ? formData.topics : formData.description,
        [isMentor ? 'experience' : 'lvl']: isMentor ? formData.experience : formData.lvl,
        availability: postgresRange
      };

      // Filter to find ONLY changed fields (Partial Logic)
      const patchData = {};
      Object.keys(currentData).forEach(key => {
        // Compare current input with the original user data from AuthContext
        if (currentData[key] !== user[key]) {
          patchData[key] = currentData[key];
        }
      });

      // If nothing changed, just close the modal
      if (Object.keys(patchData).length === 0) {
        onClose();
        return;
      }

      // Call updateProfile with isPartial = true
      await updateProfile(patchData, true); 
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Patch failed:", err);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <div className="space-y-6">
        
        {/* Profile Header */}
        <div className={`relative overflow-hidden p-6 rounded-2xl border ${accentClass} bg-slate-800/40 backdrop-blur-sm`}>
          <div className="flex items-center gap-5 relative z-10">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-2xl bg-linear-to-br ${isMentor ? 'from-indigo-500 to-purple-600' : 'from-emerald-500 to-teal-600'}`}>
              {getInitials(user?.usr_name)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{user?.usr_name}</h3>
              <p className="text-slate-400 text-sm">{user?.usr_email}</p>
              <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-${themeColor}-500/10 text-${themeColor}-400 border border-${themeColor}-500/20`}>
                {user?.usr_role} Account
              </div>
            </div>
          </div>
          <div className={`absolute -right-10 -top-10 w-32 h-32 blur-3xl opacity-20 bg-${themeColor}-500`} />
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput 
            label={isMentor ? 'Primary Expertise' : 'Current Subject'}
            icon={<Book size={16} />}
            value={formData.subject}
            onChange={(val) => setFormData(prev => ({...prev, subject: val}))}
            placeholder="e.g. Data Structures"
            themeColor={themeColor}
            fullWidth
          />

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              {isMentor ? 'Specific Topics Covered' : 'Learning Goals'}
            </label>
            <textarea 
              value={isMentor ? formData.topics : formData.description}
              onChange={(e) => setFormData(prev => ({...prev, [isMentor ? 'topics' : 'description']: e.target.value}))}
              className={`w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-${themeColor}-500 outline-none h-24 resize-none transition-all`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              {isMentor ? 'Years of Experience' : 'Skill Level'}
            </label>
            <div className="relative">
              <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              {isMentor ? (
                <input 
                  type="text" 
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({...prev, experience: e.target.value}))}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 focus:border-indigo-500 outline-none"
                />
              ) : (
                <select 
                  value={formData.lvl}
                  onChange={(e) => setFormData(prev => ({...prev, lvl: e.target.value}))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 focus:border-emerald-500 outline-none appearance-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Availability</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10" size={16} />
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                className={`w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 focus:border-${themeColor}-500 outline-none`}
              />
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full group relative flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white transition-all 
            ${showSuccess ? 'bg-blue-600' : isMentor ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
        >
          {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
                    : showSuccess ? <CheckCircle2 size={20} /> : <Save size={20} />}
          <span>{isSaving ? 'Saving...' : showSuccess ? 'Updated!' : 'Save Changes'}</span>
        </button>
      </div>
    </BaseModal>
  );
}

// Sub-component to clean up the main JSX
function FormInput({ label, icon, value, onChange, placeholder, themeColor, fullWidth }) {
  return (
    <div className={`${fullWidth ? 'md:col-span-2' : ''} space-y-1.5`}>
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">{icon}</div>
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 focus:border-${themeColor}-500 outline-none transition-all`}
        />
      </div>
    </div>
  );
}