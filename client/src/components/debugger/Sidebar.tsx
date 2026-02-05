import React, { useState, useEffect } from 'react';
import {
    History,
    Trash2,
    Wifi,
    Zap,
    Settings,
    User,
    LogOut,
    BrainCircuit,
    Plus,
    WifiOff
} from 'lucide-react';
import { HistoryItem } from '../../types/debugger';
import { useAuth } from '@/contexts/AuthContext';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SidebarProps {
    history: HistoryItem[];
    onSelectSession: (id: string) => void;
    onNewSession: () => void;
    onDeleteSession: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ history, onSelectSession, onNewSession, onDeleteSession }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, signOut } = useAuth();
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected'>('connected');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Periodically check API health
        const checkHealth = async () => {
            try {
                const res = await fetch('/api/health');
                if (res.ok) {
                    setApiStatus('connected');
                } else {
                    setApiStatus('disconnected');
                }
            } catch (e) {
                setApiStatus('disconnected');
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 30000);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(interval);
        };
    }, []);

    const isSystemHealthy = isOnline && apiStatus === 'connected';

    return (
        <div className="hidden md:flex flex-col w-[280px] h-full shrink-0 gap-4">

            {/* Header Card */}
            <div className="glass-panel p-5 rounded-[2rem] flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={onNewSession}>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-neon-purple to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(176,38,255,0.4)]">
                        <BrainCircuit className="text-white w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display font-bold text-lg leading-none tracking-tight text-white">GapSight</span>
                        <span className="text-[10px] text-neon-purple font-medium tracking-widest uppercase">Clarity beyond Correctness</span>
                    </div>
                </div>
            </div>

            {/* Main Navigation / History Dock */}
            <div className="glass-panel flex-1 rounded-[2rem] p-4 flex flex-col overflow-hidden relative group">

                {/* New Session Button */}
                <button
                    onClick={onNewSession}
                    className="w-full mb-6 relative overflow-hidden group/btn rounded-xl bg-white/5 border border-white/10 p-3 transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(176,38,255,0.15)]"
                >
                    <div className="flex items-center justify-center gap-2 relative z-10">
                        <Plus className="w-4 h-4 text-neon-purple" />
                        <span className="text-sm font-medium text-gray-200">New Diagnosis</span>
                    </div>
                </button>

                {/* History Label */}
                <div className="px-2 mb-3 flex items-center gap-2">
                    <History className="w-3 h-3 text-gray-500" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Recent Scans</span>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {history.length === 0 ? (
                        <div className="text-center py-10 opacity-30 text-xs">No recent history</div>
                    ) : (
                        history.map((item) => (
                            <div
                                key={item.id}
                                className="group/item relative p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer"
                                onClick={() => onSelectSession(item.id)}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xs font-medium text-gray-300 line-clamp-2 leading-relaxed group-hover/item:text-white transition-colors">
                                        {item.topic}
                                    </h3>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteId(item.id);
                                            setIsDeleteDialogOpen(true);
                                        }}
                                        className="opacity-0 group-hover/item:opacity-100 text-gray-500 hover:text-red-400 transition-all ml-2"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Visual Score Indicator */}
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-[10px] text-gray-600">{item.date}</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1 w-12 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${item.score >= 70 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' :
                                                    item.score >= 40 ? 'bg-amber-400' : 'bg-red-400'
                                                    }`}
                                                style={{ width: `${item.score}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Status Footer inside Panel */}
                <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
                    <div className={`rounded-lg p-2 flex flex-col items-center justify-center gap-1 border border-white/5 transition-colors ${isSystemHealthy ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                        {isSystemHealthy ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-red-400" />}
                        <span className={`text-[9px] uppercase tracking-wider ${isSystemHealthy ? 'text-emerald-200' : 'text-red-300'}`}>
                            {isSystemHealthy ? 'Online' : 'Offline'}
                        </span>
                    </div>
                    <div className="bg-black/20 rounded-lg p-2 flex flex-col items-center justify-center gap-1 border border-white/5">
                        <Zap className="w-3 h-3 text-neon-cyan" />
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider">v2.5 Flash</span>
                    </div>
                </div>
            </div>

            {/* User Profile Pill */}
            <div className="glass-panel p-2 rounded-[1.5rem] flex items-center justify-between relative group">
                <div
                    className="flex items-center gap-3 p-1 pl-2 w-full cursor-pointer hover:bg-white/5 rounded-[1.2rem] transition-colors"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                        {user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-200">{user?.email?.split('@')[0] || 'User'}</span>
                        <span className="text-[9px] text-gray-500">Pro Plan</span>
                    </div>
                    <Settings className="w-4 h-4 text-gray-600 ml-auto mr-2 group-hover:rotate-90 transition-transform duration-500" />
                </div>

                {showUserMenu && (
                    <div className="absolute bottom-full left-0 w-full mb-2 glass-panel rounded-xl overflow-hidden p-1 z-50 animate-in fade-in slide-in-from-bottom-2">
                        <button className="w-full text-left flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg text-xs text-gray-300">
                            <User className="w-3 h-3" /> Profile
                        </button>
                        <button
                            onClick={signOut}
                            className="w-full text-left flex items-center gap-2 p-2 hover:bg-red-500/10 text-red-400 rounded-lg text-xs"
                        >
                            <LogOut className="w-3 h-3" /> Logout
                        </button>
                    </div>
                )}
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this scan session.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => {
                                if (deleteId) {
                                    onDeleteSession(deleteId);
                                    setDeleteId(null);
                                }
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
};
