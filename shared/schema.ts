import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const diagnostics = pgTable("diagnostics", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  sessionId: text("session_id").notNull(),
  conceptName: text("concept_name"), // Made optional as AI can infer
  userExplanation: text("user_explanation").notNull(),
  rootCause: text("root_cause"),
  confidence: integer("confidence"),
  repairQuestion: text("repair_question"),
  missingPrerequisites: jsonb("missing_prerequisites").$type<string[]>(),
  learningResources: jsonb("learning_resources").$type<LearningResource[]>(),
  knowledgeCoverage: integer("knowledge_coverage"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDiagnosticSchema = createInsertSchema(diagnostics).omit({
  id: true,
  createdAt: true,
});

export type Diagnostic = typeof diagnostics.$inferSelect;
export type InsertDiagnostic = z.infer<typeof insertDiagnosticSchema>;

export type LearningResource = {
  title: string;
  type: 'article' | 'video' | 'text' | 'course';
  url?: string;
  content?: string;
  relevance: string; // Why this resource?
};

// API Types
export type DiagnoseRequest = {
  concept_name?: string;
  user_explanation: string;
  session_id?: string;
  user_id: string;
};

export type DiagnoseResponse = {
  root_cause: string;
  confidence: number;
  repair_question: string;
  missing_prerequisites: string[];
  learning_resources: LearningResource[];
  knowledge_coverage: number;
  session_id: string;
  user_id: string;
  diagnosis_id: number;
  timestamp: string;
};

export type HealthResponse = {
  status: "healthy" | "unhealthy";
  gemini_status: "connected" | "disconnected";
  timestamp: string;
};

// Chat tables
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
