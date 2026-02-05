import { z } from 'zod';
import { insertDiagnosticSchema, diagnostics } from './schema.js';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  diagnostics: {
    create: {
      method: 'POST' as const,
      path: '/api/diagnose',
      input: z.object({
        concept_name: z.string().optional(),
        user_explanation: z.string().min(1, "Explanation is required"),
        session_id: z.string().optional(),
        user_id: z.string().min(1, "User ID is required"),
      }),
      responses: {
        200: z.object({
          root_cause: z.string(),
          confidence: z.number(),
          repair_question: z.string(),
          missing_prerequisites: z.array(z.string()),
          learning_resources: z.array(z.object({
            title: z.string(),
            type: z.string(),
            url: z.string().optional(),
            content: z.string().optional(),
            relevance: z.string()
          })),
          knowledge_coverage: z.number(),
          session_id: z.string(),
          user_id: z.string(),
          diagnosis_id: z.number(),
          timestamp: z.string(),
        }),
        500: errorSchemas.internal,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/history/:userId',
      responses: {
        200: z.array(z.custom<typeof diagnostics.$inferSelect>()),
      },
    },
    delete: {
      // Request said "individual session delete". Let's stick to 'delete' for single item.
      // But to keep clean, I will rename 'clear' to 'delete' or just add 'delete'.
      // Existing "clear session history" might still be useful? The plan said "individual delete".
      // Let's repurpose or add. "api.diagnostics.delete" is cleaner.
      method: 'DELETE' as const,
      path: '/api/diagnostic/:id',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
  },
  health: {
    check: {
      method: 'GET' as const,
      path: '/api/health',
      responses: {
        200: z.object({
          status: z.enum(["healthy", "unhealthy"]),
          gemini_status: z.enum(["connected", "disconnected"]),
          timestamp: z.string(),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
