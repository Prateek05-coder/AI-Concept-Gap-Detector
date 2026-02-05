import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/debugger/Sidebar';
import { InputSection } from '../components/debugger/InputSection';
import { AnalysisDashboard } from '../components/debugger/AnalysisDashboard';
import { HistoryItem, AnalysisResult, AppView } from '../types/debugger';
import { analyzeExplanation, fetchHistory, fetchSession } from '../services/geminiService';

const DebuggerPage: React.FC = () => {
    const [view, setView] = useState<AppView>('INPUT');
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
    const [sessionHistory, setSessionHistory] = useState<AnalysisResult[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Initial History Fetch
    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const data = await fetchHistory();
        setHistory(data);
    };

    // Function to convert file to base64 for Gemini
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleAnalyze = async (concept: string, explanation: string, image?: File) => {
        setIsAnalyzing(true);
        try {
            let imageData = undefined;
            if (image) {
                imageData = await fileToBase64(image);
            }

            const result = await analyzeExplanation(
                concept,
                explanation,
                imageData,
                image,
                currentResult?.sessionId // Pass session ID if exists for continuation
            );

            setCurrentResult(result);

            // Update session history state
            if (currentResult?.sessionId === result.sessionId) {
                setSessionHistory(prev => [...prev, result]);
            } else {
                setSessionHistory([result]);
            }

            // Re-fetch history to ensure we have the correct server-generated ID and data
            // Or strictly speaking we could optimistic update, but fetch is safer for consistent IDs
            await loadHistory();

            setView('ANALYSIS');
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSelectSession = async (id: string) => {
        const session = history.find(item => item.id === id);
        if (session) {
            // Optimistic update
            setCurrentResult(session.result);
            setView('ANALYSIS');

            // Full fetch for history
            const fullSession = await fetchSession(id);
            if (fullSession.length > 0) {
                setSessionHistory(fullSession);
                setCurrentResult(fullSession[fullSession.length - 1]);
            } else {
                setSessionHistory([session.result]);
            }
        }
    };

    const handleContinue = async (explanation: string) => {
        if (!currentResult) return;
        // Use existing concept name and session ID
        await handleAnalyze(currentResult.conceptName, explanation, undefined);
    };

    const handleDeleteSession = (id: string) => {
        // Optimistic delete
        setHistory(prev => prev.filter(item => item.id !== id));
        // TODO: Call backend delete API

        // If deleting the currently viewed session, go back to input
        if (currentResult && history.find(item => item.id === id)?.result === currentResult) {
            setView('INPUT');
            setCurrentResult(null);
        }
    };

    return (
        <div className="relative w-full h-screen bg-dark-bg text-dark-text overflow-hidden font-sans selection:bg-neon-purple/30 selection:text-white">

            {/* Ambient Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-30"></div>
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-blob mix-blend-screen"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-screen"></div>
                <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen"></div>
            </div>

            <div className="relative z-10 flex w-full h-full p-4 md:p-6 gap-6">
                {/* Floating Sidebar */}
                <Sidebar
                    history={history}
                    onSelectSession={handleSelectSession}
                    onNewSession={() => { setView('INPUT'); setCurrentResult(null); }}
                    onDeleteSession={handleDeleteSession}
                />

                {/* Floating Main Content Area */}
                <main className="flex-1 h-full relative rounded-[2rem] overflow-hidden glass-panel flex flex-col transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                    <div className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
                        {view === 'INPUT' && (
                            <InputSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
                        )}

                        {view === 'ANALYSIS' && currentResult && (
                            <AnalysisDashboard
                                result={currentResult}
                                onNewSession={() => { setView('INPUT'); setCurrentResult(null); }}
                                onContinue={handleContinue}
                                isAnalyzing={isAnalyzing}
                                sessionHistory={sessionHistory}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DebuggerPage;
