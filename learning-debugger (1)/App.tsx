import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { InputSection } from './components/InputSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { HistoryItem, AnalysisResult, AppView } from './types';
import { analyzeExplanation } from './services/geminiService';

// Mock Data matching the user's screenshots
const MOCK_HISTORY: HistoryItem[] = [
  {
    id: '1',
    topic: 'React Hooks',
    date: 'Jan 25',
    score: 35,
    result: {
      conceptName: 'React Hooks',
      analysisDate: '1/25/2026',
      confidenceScore: 35,
      knowledgeCoverage: 5,
      missingPrerequisites: [
        'The definition and core purpose of React Hooks (specifically relating to state and side effects)',
        'The difference between functional components and class components in React prior to Hooks'
      ],
      rootCauseAnalysis: 'The student provided the broad context where React Hooks are used (frontend development) but failed entirely to define their purpose, core utility, or the architectural problems they solve within React. The fundamental conceptual failure is regarding *why* hooks exist versus just *where* they are used.',
      repairQuestion: 'While Hooks are indeed used in the frontend, what specific *problems* do they solve in modern React development, and how do they relate to functional components?',
      resources: [
        {
          type: 'ARTICLE',
          title: 'Introducing Hooks - Official React Documentation',
          description: 'This is the definitive starting point, clearly explaining why Hooks were created and what core capabilities they unlock.',
          url: 'https://react.dev/reference/react'
        },
        {
          type: 'SEARCH',
          title: 'React Hooks vs Class Components',
          description: 'Understanding the historical context—why class components were cumbersome and how Hooks offer a cleaner alternative.',
          url: 'https://google.com'
        }
      ],
      originalExplanation: 'It is used for frontend'
    }
  },
  {
    id: '2',
    topic: 'Photosynthesis',
    date: 'Jan 25',
    score: 65,
    result: {
      conceptName: 'Photosynthesis',
      analysisDate: '1/25/2026',
      confidenceScore: 65,
      knowledgeCoverage: 60,
      missingPrerequisites: [
        'The distinction between Light-Dependent Reactions and the Calvin Cycle',
        'The specific role of ATP and NADPH as energy carriers'
      ],
      rootCauseAnalysis: 'The explanation correctly identifies that plants make food from sunlight but misses the biochemical mechanics of how that energy is actually stored and transformed.',
      repairQuestion: 'Can you explain what happens to the energy generated in the thylakoid membranes before it becomes glucose?',
      resources: [],
      originalExplanation: 'Plants take in sunlight and water and turn it into energy and oxygen. This happens in the chloroplasts.'
    }
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('INPUT');
  const [history, setHistory] = useState<HistoryItem[]>(MOCK_HISTORY);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

      const result = await analyzeExplanation(concept, explanation, imageData);
      
      setCurrentResult(result);
      
      // Add to history
      setHistory(prev => [{
        id: Date.now().toString(),
        topic: result.conceptName,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: result.confidenceScore,
        result: result
      }, ...prev]);
      
      setView('ANALYSIS');
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSession = (id: string) => {
    const session = history.find(item => item.id === id);
    if (session) {
      setCurrentResult(session.result);
      setView('ANALYSIS');
    }
  };

  const handleDeleteSession = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
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
              <AnalysisDashboard result={currentResult} onNewSession={() => { setView('INPUT'); setCurrentResult(null); }} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
