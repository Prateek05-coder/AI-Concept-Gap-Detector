
import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

async function testAiResponse() {
    const genAI = new GoogleGenAI({
        apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "AIzaSyAKl_M_1hQivFH3E7AMgqFpgzsdzBE5Hd8",
        httpOptions: { apiVersion: "v1beta", baseUrl: "https://generativelanguage.googleapis.com" }
    });

    const model = "models/gemini-2.5-flash";
    const SYSTEM_PROMPT = `You are an elite Educational Diagnostician AI.
      
Your mission: identifying the EXACT point of conceptual failure in a student's explanation and providing HIGH-QUALITY resources.

ANALYSIS PROTOCOL:
1. Parse the student's explanation for logical gaps.
2. Identify the EARLIEST missing prerequisite concept.
3. INFER the Concept Name if it is not provided.
4. RECOMMEND RESOURCES (MANDATORY):
   - You MUST provide at least 2, max 4 resources.
   - **URLs must be real**: prioritized official docs (React, MDN, Python.org).
   - "relevance": Explain *specifically* why this link helps.

RESPONSE FORMAT (JSON ONLY):
{
  "root_cause": "Detailed analysis...",
  "confidence": 85,
  "repair_question": "Question...",
  "missing_prerequisites": ["Concept A"],
  "learning_resources": [
    {
       "title": "Exact Title of Resource",
       "type": "article",
       "url": "https://example.com",
       "relevance": "Reason..."
    }
  ],
  "knowledge_coverage": 65,
  "inferred_concept": "Concept Name"
}
NO MARKDOWN.`;

    const prompt = `Student Explanation: React uses a real DOM to update the page directly which makes it fast.`;

    console.log("Generating content...");
    const result = await genAI.models.generateContent({
        model: model,
        contents: [
            { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
            { role: "user", parts: [{ text: prompt }] }
        ],
        config: { responseMimeType: "application/json" }
    });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("Raw Response:", text);
}

testAiResponse();
