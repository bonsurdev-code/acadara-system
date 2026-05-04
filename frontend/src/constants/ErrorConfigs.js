import { AlertTriangle, Lock, Search, UserCheck } from "lucide-react";

export const errorConfigs = {
    "401": {
        icon: UserCheck,
        title: "Unauthorized",
        desc: "Your session has expired or you are not signed in.",
        color: "text-rose-500",
    },
    "403": {
        icon: Lock,
        title: "Access Forbidden",
        desc: "You don't have permission to access this portal.",
        color: "text-amber-500",
    },
    "404": {
        icon: Search,
        title: "Page Not Found",
        desc: "The page you are looking for doesn't exist.",
        color: "text-indigo-500",
    },
    "500": {
        icon: AlertTriangle,
        title: "System Error",
        desc: "Something went wrong on our end.",
        color: "text-red-500",
    },
};