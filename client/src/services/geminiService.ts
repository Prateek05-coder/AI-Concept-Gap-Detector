import { AnalysisResult, HistoryItem } from "../types/debugger";

// Helper to determine resource type label if backend sends raw type
const formatResourceType = (type: string) => {
    const map: Record<string, string> = {
        'article': 'ARTICLE',
        'video': 'VIDEO',
        'course': 'COURSE',
        'text': 'TEXT'
    };
    return map[type] || type.toUpperCase();
};

export const fetchHistory = async (userId: string = "test-user"): Promise<HistoryItem[]> => {
    try {
        const response = await fetch(`/api/history/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch history");
        }
        const data = await response.json();

        // Group by sessionId
        const sessions: Record<string, any[]> = {};
        data.forEach((d: any) => {
            // Backend returns camelCase (sessionId), not snake_case
            const sId = d.sessionId;
            if (!sessions[sId]) sessions[sId] = [];
            sessions[sId].push(d);
        });

        const historyItems: HistoryItem[] = Object.values(sessions).map(sessionDiagnostics => {
            // Sort by createdAt desc to get latest
            sessionDiagnostics.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            const latest = sessionDiagnostics[0];

            return {
                id: latest.sessionId,
                topic: latest.conceptName,
                date: new Date(latest.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                score: latest.confidence,
                result: {
                    conceptName: latest.conceptName,
                    analysisDate: new Date(latest.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    confidenceScore: latest.confidence,
                    knowledgeCoverage: latest.knowledgeCoverage,
                    missingPrerequisites: latest.missingPrerequisites || [],
                    rootCauseAnalysis: latest.rootCause,
                    repairQuestion: latest.repairQuestion,
                    resources: (latest.learningResources || []).map((r: any) => ({
                        title: r.title,
                        type: formatResourceType(r.type || 'article'),
                        url: r.url,
                        content: r.content,
                        relevance: r.relevance
                    })),
                    originalExplanation: latest.userExplanation,
                    sessionId: latest.sessionId
                }
            };
        });

        // Sort sessions by latest activity
        return historyItems.sort((a, b) => new Date(b.result.analysisDate).getTime() - new Date(a.result.analysisDate).getTime());

    } catch (error) {
        console.error("Fetch History Error:", error);
        return [];
    }
};

export const fetchSession = async (sessionId: string): Promise<AnalysisResult[]> => {
    try {
        const response = await fetch(`/api/session/${sessionId}`);
        if (!response.ok) throw new Error("Failed to fetch session");
        const data = await response.json();

        return data.map((d: any) => ({
            conceptName: d.conceptName,
            analysisDate: new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            confidenceScore: d.confidence,
            knowledgeCoverage: d.knowledgeCoverage,
            missingPrerequisites: d.missingPrerequisites || [],
            rootCauseAnalysis: d.rootCause,
            repairQuestion: d.repairQuestion,
            resources: (d.learningResources || []).map((r: any) => ({
                title: r.title,
                type: formatResourceType(r.type || 'article'),
                url: r.url,
                content: r.content,
                relevance: r.relevance
            })),
            originalExplanation: d.userExplanation,
            sessionId: d.sessionId
        }));
    } catch (error) {
        console.error("Fetch Session Error:", error);
        return [];
    }
};

export const analyzeExplanation = async (
    concept: string,
    explanation: string,
    imageData?: string, // Kept for compatibility but we need to handle File object or base64
    file?: File, // Explicit file object support for FormData
    sessionId?: string,
    userId?: string
): Promise<AnalysisResult> => {

    const formData = new FormData();

    if (concept && concept !== "Unknown Concept") {
        formData.append("concept_name", concept);
    }

    formData.append("user_explanation", explanation);

    // Use passed userId or a fallback (though in real app, we should enforce auth)
    formData.append("user_id", userId || "test-user");

    if (sessionId) {
        formData.append("session_id", sessionId);
    }

    if (file) {
        formData.append("file", file);
    }

    try {
        const response = await fetch('/api/diagnose', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error("Analysis service busy. Please try again in a moment.");
            }
            const errText = await response.text();
            let msg = "Analysis failed";
            try {
                const json = JSON.parse(errText);
                msg = json.message || msg;
            } catch (e) { }
            throw new Error(msg);
        }

        const data = await response.json();

        // Map Backend Response to Frontend AnalysisResult
        return {
            conceptName: data.inferred_concept || concept || "Analyzed Concept",
            analysisDate: new Date(data.timestamp || Date.now()).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            }),
            confidenceScore: data.confidence,
            knowledgeCoverage: data.knowledge_coverage,
            missingPrerequisites: data.missing_prerequisites || [],
            rootCauseAnalysis: data.root_cause,
            repairQuestion: data.repair_question,
            resources: (data.learning_resources || []).map((r: any) => ({
                title: r.title,
                type: formatResourceType(r.type),
                url: r.url,
                content: r.content,
                relevance: r.relevance
            })),
            originalExplanation: explanation,
            sessionId: data.session_id
        };

    } catch (error: any) {
        console.error("Diagnostic API Error:", error);
        // Return a fallback or rethrow to be handled by UI
        throw error;
    }
};
