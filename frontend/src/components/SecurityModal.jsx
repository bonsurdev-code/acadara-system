import BaseModal from './BaseModal';

const ActionButton = ({ label, primary }) => (
  <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
    primary 
      ? "bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20" 
      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
  }`}>
    {label}
  </button>
);
export default function SecurityModal({ isOpen, onClose }) {

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Privacy & Security">
      <div className="space-y-4">
        <p className="text-sm text-slate-400">Update your security credentials.</p>
        <ActionButton label="Change Password" primary />
        <ActionButton label="Enable Two-Factor Auth" />
      </div>
    </BaseModal>
  );
}