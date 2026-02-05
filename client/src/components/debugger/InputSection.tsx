import React, { useState, useRef } from 'react';
import { Upload, X, ArrowRight, Sparkles, FileText, Globe, Code, Zap } from 'lucide-react';

interface InputSectionProps {
    onAnalyze: (concept: string, explanation: string, image?: File) => void;
    isAnalyzing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
    const [concept, setConcept] = useState('');
    const [explanation, setExplanation] = useState('');
    const [dontKnowName, setDontKnowName] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (!explanation.trim()) return;
        onAnalyze(dontKnowName ? "Unknown Concept" : concept, explanation, file || undefined);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-full py-10 px-6 animate-in fade-in duration-700">

            {/* Central Hero Text */}
            <div className="text-center mb-10 relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-neon-cyan mb-4 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></span>
                    Neural Debug Protocol Active
                </div>
                <h1 className="font-display text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-4 tracking-tight drop-shadow-2xl">
                    Identify The Gap
                </h1>
                <p className="text-dark-muted text-lg font-light max-w-lg mx-auto">
                    Explain a concept. The AI will deconstruct your mental model and find missing dependencies.
                </p>
            </div>

            {/* Main Interface Card */}
            <div className="w-full max-w-2xl relative group">

                {/* Glowing Background Blur Effect behind card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple via-blue-600 to-neon-cyan rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative glass-panel rounded-[2rem] p-1 overflow-hidden">
                    <div className="bg-[#0A0A10]/80 backdrop-blur-xl rounded-[1.8rem] p-6 md:p-8 space-y-6">

                        {/* Concept Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Target Concept</label>
                                <button
                                    onClick={() => setDontKnowName(!dontKnowName)}
                                    className={`text-[10px] px-2 py-0.5 rounded border transition-all ${dontKnowName
                                            ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_10px_rgba(176,38,255,0.3)]'
                                            : 'border-white/10 text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    I DON'T KNOW THE NAME
                                </button>
                            </div>
                            <div className="relative group/input">
                                <Zap className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${concept ? 'text-neon-cyan' : 'text-gray-600'}`} />
                                <input
                                    type="text"
                                    value={concept}
                                    onChange={(e) => setConcept(e.target.value)}
                                    disabled={dontKnowName}
                                    placeholder={dontKnowName ? "System will auto-detect concept from context..." : "e.g. Asynchronous Javascript, Entropy..."}
                                    className={`w-full glass-input rounded-xl py-4 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none transition-all ${dontKnowName ? 'opacity-50 cursor-not-allowed italic' : ''}`}
                                />
                            </div>
                        </div>

                        {/* Explanation Area */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Mental Model Input</label>
                            <div className="relative">
                                <textarea
                                    value={explanation}
                                    onChange={(e) => setExplanation(e.target.value)}
                                    placeholder="Explain it like you are teaching someone..."
                                    className="w-full h-40 glass-input rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none resize-none leading-relaxed custom-scrollbar"
                                />
                                <div className="absolute bottom-3 right-3 flex gap-2">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/20"
                                        title="Upload diagram or notes"
                                    >
                                        <Upload className="w-4 h-4" />
                                    </button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
                                </div>
                            </div>

                            {file && (
                                <div className="flex items-center gap-2 bg-neon-purple/10 border border-neon-purple/30 px-3 py-2 rounded-lg inline-flex animate-in fade-in slide-in-from-bottom-1">
                                    <FileText className="w-3 h-3 text-neon-purple" />
                                    <span className="text-xs text-neon-purple truncate max-w-[150px]">{file.name}</span>
                                    <button onClick={() => setFile(null)} className="hover:bg-neon-purple/20 rounded p-0.5 ml-1">
                                        <X className="w-3 h-3 text-neon-purple" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Launch Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={!explanation.trim() || isAnalyzing}
                            className="group relative w-full h-14 overflow-hidden rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-blue-600 to-neon-purple bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]"></div>
                            <div className="absolute inset-[1px] bg-[#0A0A10] rounded-[11px] group-hover:bg-transparent transition-colors duration-300"></div>

                            <div className="relative h-full flex items-center justify-center gap-3">
                                {isAnalyzing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span className="font-display font-bold text-white tracking-widest uppercase">Processing Neural Net...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-display font-bold text-white tracking-widest uppercase group-hover:text-white transition-colors">Initiate Analysis</span>
                                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>

                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-6 text-[10px] text-gray-500 font-mono uppercase tracking-widest opacity-60">
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Global Context</span>
                <span className="flex items-center gap-1"><Code className="w-3 h-3" /> Syntax Aware</span>
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Gemini 2.5</span>
            </div>

        </div>
    );
};
