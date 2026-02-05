import { supabase } from "./db.js";
import type { InsertDiagnostic, Diagnostic } from "../shared/schema.js";

export interface IStorage {
  createDiagnostic(diagnostic: InsertDiagnostic): Promise<Diagnostic>;
  getDiagnosticsBySession(sessionId: string): Promise<Diagnostic[]>;
  getDiagnosticsByUser(userId: string): Promise<Diagnostic[]>;
  deleteDiagnostic(id: number): Promise<void>;
  // Legacy or admin use maybe, but primarily we want user-scoped
  // clearSessionHistory(sessionId: string): Promise<void>; 
}

export class DatabaseStorage implements IStorage {
  async createDiagnostic(insertDiagnostic: InsertDiagnostic): Promise<Diagnostic> {
    const { data, error } = await supabase
      .from('diagnostics')
      .insert({
        session_id: insertDiagnostic.sessionId,
        user_id: insertDiagnostic.userId,
        concept_name: insertDiagnostic.conceptName,
        user_explanation: insertDiagnostic.userExplanation,
        root_cause: insertDiagnostic.rootCause,
        confidence: insertDiagnostic.confidence,
        repair_question: insertDiagnostic.repairQuestion,
        missing_prerequisites: insertDiagnostic.missingPrerequisites,
        learning_resources: insertDiagnostic.learningResources,
        knowledge_coverage: insertDiagnostic.knowledgeCoverage
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create diagnostic: ${error.message}`);
    }

    return this.mapToDiagnostic(data);
  }

  async getDiagnosticsBySession(sessionId: string): Promise<Diagnostic[]> {
    const { data, error } = await supabase
      .from('diagnostics')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true }); // Oldest first for context

    if (error) {
      // It's okay if empty, but error should be logged. 
      // Return empty array on error to safely degrade? No, throw clean error.
      throw new Error(`Failed to fetch session diagnostics: ${error.message}`);
    }

    return (data || []).map(this.mapToDiagnostic);
  }

  async getDiagnosticsByUser(userId: string): Promise<Diagnostic[]> {
    const { data, error } = await supabase
      .from('diagnostics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(`Failed to fetch diagnostics: ${error.message}`);
    }

    return (data || []).map(this.mapToDiagnostic);
  }

  async deleteDiagnostic(id: number): Promise<void> {
    const { error } = await supabase
      .from('diagnostics')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete diagnostic: ${error.message}`);
    }
  }

  private mapToDiagnostic(row: any): Diagnostic {
    return {
      id: row.id,
      sessionId: row.session_id,
      userId: row.user_id,
      conceptName: row.concept_name,
      userExplanation: row.user_explanation,
      rootCause: row.root_cause,
      confidence: row.confidence,
      repairQuestion: row.repair_question,
      missingPrerequisites: row.missing_prerequisites,
      learningResources: row.learning_resources,
      knowledgeCoverage: row.knowledge_coverage,
      createdAt: new Date(row.created_at)
    };
  }
}

export const storage = new DatabaseStorage();
