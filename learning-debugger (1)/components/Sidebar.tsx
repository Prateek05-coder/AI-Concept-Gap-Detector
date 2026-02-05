import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  Wifi, 
  Cpu, 
  Settings, 
  User, 
  LogOut, 
  BrainCircuit,
  Plus,
  Zap
} from 'lucide-react';
import { HistoryItem } from '../types';

interface SidebarProps {
  history: HistoryItem[];
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ history, onSelectSession, onNewSession, onDeleteSession }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="hidden md:flex flex-col w-[280px] h-full shrink-0 gap-4">
      
      {/* Header Card */}
      <div className="glass-panel p-5 rounded-[2rem] flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNewSession}>
           <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-neon-purple to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(176,38,255,0.4)]">
             <BrainCircuit className="text-white w-5 h-5" />
           </div>
           <div className="flex flex-col">
             <span className="font-display font-bold text-lg leading-none tracking-tight text-white">Debugger</span>
             <span className="text-[10px] text-neon-purple font-medium tracking-widest uppercase">AI System</span>
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
                    onClick={(e) => { e.stopPropagation(); onDeleteSession(item.id); }}
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
                         className={`h-full rounded-full ${
                           item.score >= 70 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' :
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
           <div className="bg-black/20 rounded-lg p-2 flex flex-col items-center justify-center gap-1 border border-white/5">
             <Wifi className="w-3 h-3 text-emerald-400" />
             <span className="text-[9px] text-gray-400 uppercase tracking-wider">Online</span>
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
            PM
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-200">Prateek</span>
            <span className="text-[9px] text-gray-500">Pro Plan</span>
          </div>
          <Settings className="w-4 h-4 text-gray-600 ml-auto mr-2 group-hover:rotate-90 transition-transform duration-500" />
        </div>
        
        {showUserMenu && (
          <div className="absolute bottom-full left-0 w-full mb-2 glass-panel rounded-xl overflow-hidden p-1 z-50 animate-in fade-in slide-in-from-bottom-2">
            <button className="w-full text-left flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg text-xs text-gray-300">
               <User className="w-3 h-3" /> Profile
            </button>
            <button className="w-full text-left flex items-center gap-2 p-2 hover:bg-red-500/10 text-red-400 rounded-lg text-xs">
               <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        )}
      </div>

    </div>
  );
};