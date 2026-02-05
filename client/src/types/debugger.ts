export interface HistoryItem {
    id: string;
    topic: string;
    date: string;
    score: number;
    result: AnalysisResult;
}

export interface Resource {
    title: string;
    type: string;
    url?: string;
    content?: string;
    relevance: string;
}

export interface AnalysisResult {
    conceptName: string;
    analysisDate: string;
    confidenceScore: number;
    knowledgeCoverage: number;
    missingPrerequisites: string[];
    rootCauseAnalysis: string;
    repairQuestion: string;
    resources: Resource[];
    originalExplanation: string;
    sessionId?: string; // Added for chat flow
}

export type AppView = 'INPUT' | 'ANALYSIS' | 'LOADING';
