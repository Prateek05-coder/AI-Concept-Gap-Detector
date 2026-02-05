import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { 
  AlertTriangle, 
  Book, 
  ArrowUpRight, 
  RotateCcw,
  Layers,
  Search,
  CheckCircle2,
  Brain,
  Sparkles
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onNewSession: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onNewSession }) => {
  const chartData = [
    { name: 'Score', value: result.confidenceScore, fill: '#b026ff' }
  ];

  return (
    <div className="w-full p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header with Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neon-purple/20 border border-neon-purple/50">
               <Brain className="w-3 h-3 text-neon-purple" />
             </span>
             <span className="text-[10px] font-bold text-neon-purple tracking-[0.2em] uppercase">Diagnostic Complete</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
            {result.conceptName}
          </h1>
          <p className="text-gray-400 font-light flex items-center gap-2 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Analyzed {result.analysisDate}
          </p>
        </div>
        
        <button 
          onClick={onNewSession}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white text-gray-300 text-sm font-medium transition-all group"
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
          <span>New Diagnosis</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Metrics */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Main Score Card */}
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 bg-neon-purple/10 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-neon-purple/20 transition-all duration-700"></div>
            
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Understanding Score</h3>
            
            <div className="h-48 relative flex items-center justify-center -my-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="75%" 
                  outerRadius="100%" 
                  barSize={12} 
                  data={chartData} 
                  startAngle={180} 
                  endAngle={0}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar 
                    background={{ fill: 'rgba(255,255,255,0.05)' }} 
                    dataKey="value" 
                    cornerRadius={50} 
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-4">
                <span className="font-display text-5xl font-bold text-white block drop-shadow-[0_0_10px_rgba(176,38,255,0.5)]">
                  {result.confidenceScore}
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">/ 100</span>
              </div>
            </div>
            
            <div className="bg-black/20 rounded-xl p-3 border border-white/5 backdrop-blur-sm">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-[10px] text-gray-400 uppercase">Topic Coverage</span>
                 <span className="text-xs font-bold text-white">{result.knowledgeCoverage}%</span>
               </div>
               <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-blue-500 to-neon-cyan" style={{ width: `${result.knowledgeCoverage}%` }}></div>
               </div>
            </div>
          </div>

          {/* Missing Prerequisites */}
          <div className="glass-panel rounded-3xl p-6 border-l-4 border-l-red-500/50">
            <h3 className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest mb-4">
              <AlertTriangle className="w-4 h-4" /> Detected Gaps
            </h3>
            <div className="space-y-3">
              {result.missingPrerequisites.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start p-2 rounded-lg hover:bg-red-500/5 transition-colors">
                  <span className="text-red-500 font-mono text-xs mt-0.5">0{idx + 1}</span>
                  <span className="text-sm text-gray-300 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: Analysis & Repair */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Analysis Text */}
          <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-transparent"></div>
             <div className="flex items-center gap-2 mb-4">
               <Layers className="w-5 h-5 text-neon-cyan" />
               <h3 className="text-lg font-bold text-white">Analysis Vector</h3>
             </div>
             <p className="text-gray-300 leading-relaxed text-md font-light">
               {result.rootCauseAnalysis}
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Repair Question */}
            <div className="glass-panel rounded-3xl p-6 bg-gradient-to-bl from-blue-900/20 to-transparent border-blue-500/20">
               <div className="flex items-center gap-2 mb-4">
                 <Sparkles className="w-4 h-4 text-blue-400" />
                 <h3 className="text-sm font-bold text-blue-100 uppercase tracking-wider">Bridge The Gap</h3>
               </div>
               <div className="bg-black/30 border border-white/5 rounded-2xl p-5 mb-4 relative">
                 <div className="absolute -top-2 -left-2 text-4xl text-white/10 font-serif">"</div>
                 <p className="text-white italic relative z-10 text-sm leading-relaxed">
                   {result.repairQuestion}
                 </p>
               </div>
               <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                 Attempt Answer <ArrowUpRight className="w-3 h-3" />
               </button>
            </div>

            {/* Resources */}
            <div className="glass-panel rounded-3xl p-6">
               <div className="flex items-center gap-2 mb-4">
                 <Book className="w-4 h-4 text-neon-purple" />
                 <h3 className="text-sm font-bold text-purple-100 uppercase tracking-wider">Knowledge Base</h3>
               </div>
               <div className="space-y-3">
                 {result.resources.slice(0, 2).map((res, idx) => (
                   <a key={idx} href={res.url || '#'} className="block group p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
                     <div className="flex justify-between items-start mb-1">
                       <span className="text-[9px] font-bold text-neon-purple border border-neon-purple/30 px-1.5 py-0.5 rounded">{res.type}</span>
                       <ArrowUpRight className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors" />
                     </div>
                     <h4 className="text-sm font-medium text-gray-200 group-hover:text-neon-cyan transition-colors truncate">{res.title}</h4>
                   </a>
                 ))}
                 {result.resources.length === 0 && (
                   <div className="text-xs text-gray-500 text-center py-4">Generating custom resources...</div>
                 )}
               </div>
            </div>
          </div>
          
          {/* User's Original Input collapsed/expandable could go here, for now simple footer */}
          <div className="p-4 rounded-2xl border border-white/5 bg-black/20">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Source Input</h4>
            <p className="text-xs text-gray-400 italic line-clamp-2">
              "{result.originalExplanation}"
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};