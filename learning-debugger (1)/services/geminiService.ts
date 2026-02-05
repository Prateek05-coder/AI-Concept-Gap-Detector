import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize the client. 
// NOTE: In a real production app, you might proxy this through a backend.
// For this demo, we use the environment variable directly.
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. Mock data might be used or calls will fail.");
  }
  return new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });
};

export const analyzeExplanation = async (
  concept: string,
  explanation: string,
  imageData?: string
): Promise<AnalysisResult> => {
  const ai = getAiClient();

  // Schema definition for structured JSON output
  const schema = {
    type: Type.OBJECT,
    properties: {
      conceptName: { type: Type.STRING },
      confidenceScore: { type: Type.INTEGER, description: "A score from 0 to 100 representing understanding confidence." },
      knowledgeCoverage: { type: Type.INTEGER, description: "Percentage from 0 to 100 showing how much of the topic was covered." },
      missingPrerequisites: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of key concepts the user missed or misunderstood."
      },
      rootCauseAnalysis: { type: Type.STRING, description: "Detailed explanation of why the user has this gap." },
      repairQuestion: { type: Type.STRING, description: "A specific question to help the user bridge the gap." },
      resources: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING, enum: ["ARTICLE", "TUTORIAL", "SEARCH"] },
                title: { type: Type.STRING },
                description: { type: Type.STRING }
            }
        }
      }
    },
    required: ["conceptName", "confidenceScore", "knowledgeCoverage", "missingPrerequisites", "rootCauseAnalysis", "repairQuestion", "resources"]
  };

  const prompt = `
    You are an expert educational debugger. Your goal is to analyze a student's explanation of a concept, 
    identify gaps in their mental model, and provide structured feedback.
    
    The student is trying to explain: "${concept || 'Unknown Concept'}".
    The student's explanation is: "${explanation}".
    
    Analyze strictly based on what they wrote. Be critical but constructive.
    If the explanation is very poor or irrelevant, give a low score.
  `;

  try {
    const parts: any[] = [{ text: prompt }];
    
    if (imageData) {
       // Assuming imageData is base64 string
       // Remove data url prefix if present
       const base64Data = imageData.split(',')[1] || imageData;
       parts.push({
           inlineData: {
               mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or detect from string
               data: base64Data
           }
       });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-latest",
      contents: {
        parts: parts
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a helpful, dark-mode aesthetic loving AI tutor."
      }
    });

    const result = JSON.parse(response.text || "{}");
    
    // Enrich with local data
    return {
      ...result,
      analysisDate: new Date().toLocaleDateString(),
      originalExplanation: explanation
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback for demo/error purposes if API fails or Key is invalid
    return {
      conceptName: concept || "Unknown Concept",
      analysisDate: new Date().toLocaleDateString(),
      confidenceScore: 10,
      knowledgeCoverage: 5,
      missingPrerequisites: ["API Connection", "Valid API Key"],
      rootCauseAnalysis: "We could not reach the analysis engine. Please check your API Key configuration.",
      repairQuestion: "Is your internet connection stable and your API Key valid?",
      resources: [],
      originalExplanation: explanation
    };
  }
};
