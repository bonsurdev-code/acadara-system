export default function MenuButtonComponent({ icon: Icon, label, onClick, variant = "default" }) {
  return (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all group
        ${variant === "danger" 
            ? "text-red-400 hover:bg-red-500/10" 
            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
    >
        <Icon size={16} className={variant !== "danger" ? "group-hover:text-indigo-400" : ""} />
        <span>{label}</span>
    </button>
  )
}
