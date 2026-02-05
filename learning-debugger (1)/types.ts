export interface HistoryItem {
  id: string;
  topic: string;
  date: string;
  score: number;
  result: AnalysisResult;
}

export interface Resource {
  type: 'ARTICLE' | 'TUTORIAL' | 'VIDEO' | 'SEARCH';
  title: string;
  description: string;
  url?: string;
}

export interface AnalysisResult {
  conceptName: string;
  analysisDate: string;
  confidenceScore: number;
  knowledgeCoverage: number; // 0 to 100
  missingPrerequisites: string[];
  rootCauseAnalysis: string;
  repairQuestion: string;
  resources: Resource[];
  originalExplanation: string;
}

export type AppView = 'INPUT' | 'ANALYSIS' | 'LOADING';
