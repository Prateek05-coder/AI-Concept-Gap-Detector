import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage.js";
import { api } from "../shared/routes.js";
import { z } from "zod";
import { GoogleGenAI, type Part } from "@google/genai";
import multer from "multer";

import mammoth from "mammoth";
import pRetry from "p-retry";

// Initialize Gemini Client
console.log("DEBUG: Initializing Gemini Client");
console.log("DEBUG: AI_INTEGRATIONS_GEMINI_API_KEY is set:", !!process.env.AI_INTEGRATIONS_GEMINI_API_KEY);
if (process.env.AI_INTEGRATIONS_GEMINI_API_KEY) {
  console.log("DEBUG: Key length:", process.env.AI_INTEGRATIONS_GEMINI_API_KEY.length);
  console.log("DEBUG: Key starts with:", process.env.AI_INTEGRATIONS_GEMINI_API_KEY.substring(0, 4) + "...");
}

if (!process.env.AI_INTEGRATIONS_GEMINI_API_KEY) {
  console.warn("WARNING: AI_INTEGRATIONS_GEMINI_API_KEY is missing. API calls will fail.");
}

const genAI = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "",
  httpOptions: {
    apiVersion: "v1beta",
    baseUrl: "https://generativelanguage.googleapis.com",
  },
});

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export function registerRoutes(
  httpServer: Server,
  app: Express
): Server {

  // Health Check
  app.get(api.health.check.path, async (_req, res) => {
    try {
      const model = genAI.models;
      res.json({
        status: "healthy",
        gemini_status: model ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.json({
        status: "unhealthy",
        gemini_status: "disconnected",
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Diagnose Endpoint
  app.post(api.diagnostics.create.path, upload.single('file'), async (req, res) => {
    try {
      // Handle FormData: Parse body fields manually if needed, or rely on body-parser (multer handles it)
      // Zod might complain if numbers are strings, but our schema is mostly strings.
      // input.concept_name might be "undefined" or null string in FormData?
      console.log("DEBUG: diagnose POST received");
      console.log("DEBUG: req.body keys:", Object.keys(req.body));
      console.log("DEBUG: req.file:", req.file ? req.file.originalname : "undefined");

      const rawBody = { ...req.body };
      // Strip "undefined" or empty strings for optional fields if needed
      if (!rawBody.concept_name || rawBody.concept_name === 'undefined' || rawBody.concept_name === '') {
        delete rawBody.concept_name;
      }
      if (!rawBody.session_id || rawBody.session_id === 'undefined' || rawBody.session_id === '') {
        delete rawBody.session_id;
      }

      const input = api.diagnostics.create.input.parse(rawBody);
      const model = "models/gemini-flash-latest";

      // 1. File Processing
      let filePart: Part | null = null;
      let extractedTextContext = "";

      if (req.file) {
        const mimeType = req.file.mimetype;
        if (mimeType === "application/pdf" || mimeType.startsWith("image/")) {
          // Send as inline data part
          filePart = {
            inlineData: {
              mimeType: mimeType,
              data: req.file.buffer.toString("base64")
            }
          };
          extractedTextContext = `[Attached File: ${req.file.originalname} (${mimeType})]`;
        } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          // DOCX -> Text extraction with Mammoth
          try {
            const result = await mammoth.extractRawText({ buffer: req.file.buffer });
            extractedTextContext = `[Attached File Content (${req.file.originalname})]:\n${result.value}\n[End of File Content]`;
          } catch (err) {
            console.error("DOCX extraction failed:", err);
            extractedTextContext = `[Attached File: ${req.file.originalname} - Text extraction failed]`;
          }
        }
      }

      // 2. Context Awareness: Fetch previous diagnostics if session_id provided
      let previousContext = "No prior context. This is the first explanation.";
      let hasHistory = false;

      if (input.session_id) {
        try {
          const history = await storage.getDiagnosticsBySession(input.session_id);
          if (history.length > 0) {
            hasHistory = true;
            previousContext = history.map((d, i) =>
              `[Turn ${i + 1}] Student thought: "${d.userExplanation}". AI Diagnosis: Root Cause="${d.rootCause}", Confidence=${d.confidence}%`
            ).join('\n');
            previousContext += `\n\n[Current Turn] Student now says: "${input.user_explanation}"`;
          }
        } catch (e) {
          console.warn("Context fetch failed, proceeding without history", e);
        }
      }

      // Build Prompt
      const SYSTEM_PROMPT = `You are an elite Educational Diagnostician AI.
      
Your mission: identifying the EXACT point of conceptual failure in a student's explanation and providing HIGH-QUALITY resources.

ANALYSIS PROTOCOL:
1. REVIEW CONTEXT: If provided, compare the student's *current* explanation against their *previous* attempts. 
   - Did they fix previous errors? If yes, INCREASE confidence.
   - Did they introduce new errors? Address them.
2. IDENTIFY GAPS: Find the *earliest* missing prerequisite.
3. INFER CONCEPT: If "Concept Name" is missing or user stated "I don't know", deduce it from the text and file content.
4. CONFIDENCE SCORE:
   - 90-100: Flawless.
   - 70-89: Mostly correct, minor wording issues.
   - 40-69: Significant conceptual gaps.
   - 0-39: Wrong topic or fundamental misunderstanding.
   - **CRITICAL**: If this is a follow-up and they corrected their mistake, High Score is MANDATORY.
5. RECOMMEND RESOURCES (MANDATORY):
   - You MUST provide at least 2, max 4 resources.
   - **URLs must be real**: prioritized official docs (React, MDN, Python.org) or highly reputable tutorials (W3Schools, CSS-Tricks).
   - If you cannot find a specific URL, generate a high-quality Google Search Query URL (e.g., https://www.google.com/search?q=React+Virtual+DOM).
   - "relevance": Explain *specifically* why this link helps THIS student's specific gap.

RESPONSE FORMAT (JSON ONLY):
{
  "root_cause": "Detailed analysis...",
  "confidence": 85,
  "repair_question": "Question...",
  "missing_prerequisites": ["Concept A: Reason...", "Concept B: Reason..."],
  "learning_resources": [
    {
       "title": "Exact Title of Resource",
       "type": "article",
       "url": "https://react.dev/learn/...",
       "relevance": "Directly explains the Virtual DOM diffing process you missed."
    }
  ],
  "knowledge_coverage": 65,
  "inferred_concept": "Concept Name"
}
NO MARKDOWN.`;

      let promptText = "";
      if (hasHistory) {
        promptText = `SESSION HISTORY:\n${previousContext}\n\nTASK: Analyze the [Current Turn] based on the history. Has the student improved? Update the score accordingly.`;
      } else {
        promptText = `Student Explanation: ${input.user_explanation}`;
        if (input.concept_name) {
          promptText = `Concept: ${input.concept_name}\n${promptText}`;
        } else {
          promptText = `Concept: [Please Infer from explanation and file]\n${promptText}`;
        }
      }

      if (extractedTextContext) {
        promptText += `\n\n${extractedTextContext}`;
      }

      const promptParts: Part[] = [{ text: promptText }];
      if (filePart) {
        promptParts.push(filePart);
      }

      const result = await pRetry(
        () => genAI.models.generateContent({
          model: model,
          contents: [
            { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
            { role: "user", parts: promptParts }
          ],
          config: {
            responseMimeType: "application/json",
          }
        }),
        {
          retries: 3,
          minTimeout: 2000,
          maxTimeout: 10000,
          onFailedAttempt: error => {
            console.log(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
          }
        }
      );

      const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        throw new Error("Empty response from AI");
      }

      const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();

      let aiAnalysis;
      try {
        aiAnalysis = JSON.parse(cleanJson);
      } catch (e) {
        console.error("Failed to parse AI response:", responseText);
        throw new Error("Failed to parse diagnostic analysis");
      }

      const sessionId = input.session_id || crypto.randomUUID();
      const finalConceptName = input.concept_name || aiAnalysis.inferred_concept || "Unknown Concept";

      const diagnostic = await storage.createDiagnostic({
        sessionId,
        userId: input.user_id,
        conceptName: finalConceptName,
        userExplanation: input.user_explanation,
        rootCause: aiAnalysis.root_cause,
        confidence: aiAnalysis.confidence,
        repairQuestion: aiAnalysis.repair_question,
        missingPrerequisites: aiAnalysis.missing_prerequisites,
        learningResources: aiAnalysis.learning_resources || [], // Ensure array
        knowledgeCoverage: aiAnalysis.knowledge_coverage,
      });

      res.json({
        ...aiAnalysis,
        session_id: sessionId,
        user_id: input.user_id,
        diagnosis_id: diagnostic.id,
        timestamp: diagnostic.createdAt?.toISOString(),
      });

    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Diagnosis error:", errorMessage, err);

      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }

      // Handle Gemini Rate Limits
      if (errorMessage.includes("429") || errorMessage.includes("Too Many Requests") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
        return res.status(429).json({
          message: "AI Service is currently busy (Rate Limit Exceeded). Please try again in a minute.",
        });
      }

      // Handle Service Unavailable
      if (errorMessage.includes("503") || errorMessage.includes("Overloaded")) {
        return res.status(503).json({
          message: "AI Service is temporarily overloaded. Please try again shortly.",
        });
      }

      res.status(500).json({
        message: "Failed to generate diagnosis. Please try again.",
        error: process.env.NODE_ENV === "development" ? errorMessage : undefined
      });
    }
  });

  // History Endpoint (By User)
  app.get(api.diagnostics.list.path, async (req, res) => {
    try {
      const userId = req.params.userId as string; // Matches path /api/history/:userId
      if (!userId) throw new Error("User ID is required");

      const history = await storage.getDiagnosticsByUser(userId);
      res.json(history);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("History error:", errorMessage, err);
      res.status(500).json({
        message: "Failed to fetch history",
        error: process.env.NODE_ENV === "development" ? errorMessage : undefined
      });
    }
  });

  // Session History Endpoint
  app.get('/api/session/:sessionId', async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      if (!sessionId) return res.status(400).json({ message: "Session ID required" });

      const history = await storage.getDiagnosticsBySession(sessionId);
      res.json(history);
    } catch (err) {
      console.error("Session fetch error:", err);
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });

  // Delete Diagnostic Endpoint
  app.delete(api.diagnostics.delete.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      await storage.deleteDiagnostic(id);
      res.json({ message: "Diagnostic deleted" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Delete error:", errorMessage, err);
      res.status(500).json({
        message: "Failed to delete diagnostic",
        error: process.env.NODE_ENV === "development" ? errorMessage : undefined
      });
    }
  });

  return httpServer;
}
