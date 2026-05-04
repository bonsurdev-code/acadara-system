import { useNavigate } from "react-router-dom"
import { motion as Motion } from "framer-motion";
import { RefreshCw, Home } from "lucide-react";
import { errorConfigs } from "../constants/ErrorConfigs";

export default function ErrorPageComponent({status, message}) {
    const navigate = useNavigate();

    const config = errorConfigs[status.toString()] || errorConfigs["500"];
    const Icon = config.icon

    return (
        <div className="flex h-screen items-center justify-center bg-[#0F172A] p-6 text-center">
            <Motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md"
            >
                <div className={`inline-flex p-5 rounded-3xl bg-slate-900 border border-slate-800 mb-6 ${config.color}`}>
                <Icon size={15} className="w-12 h-12" />
                </div>
                
                <h1 className="text-6xl font-black text-white mb-2">{status}</h1>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">{config.title}</h2>
                <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                {message || config.desc}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {status === 401 ? (
                    <button 
                    onClick={() => navigate("/")}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                    >
                    Go to Login
                    </button>
                ) : (
                    <>
                    <button onClick={() => window.location.reload()} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all">
                        <RefreshCw size={18} /> Retry
                    </button>
                    <button onClick={() => navigate("/")} className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all">
                        <Home size={18} /> Back to Home
                    </button>
                    </>
                )}
                </div>
            </Motion.div>
        </div>
    )
}
