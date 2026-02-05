import { useState } from "react";
import { useDiagnose } from "@/hooks/use-diagnostics";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { Sparkles, Loader2, ArrowRight, Upload, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";

import { Diagnostic } from "@shared/schema";

interface DiagnosisFormProps {
  initialConcept?: string;
  sessionId?: string;
  onComplete?: (data: Diagnostic) => void;
}

export function DiagnosisForm({ initialConcept = "", sessionId, onComplete }: DiagnosisFormProps) {
  const [concept, setConcept] = useState(initialConcept);
  const [explanation, setExplanation] = useState("");
  const [unknownConcept, setUnknownConcept] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: diagnose, isPending } = useDiagnose();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!unknownConcept && !concept.trim()) || !explanation.trim()) return;

    // Use FormData for file upload support
    const formData = new FormData();
    if (!unknownConcept) {
      formData.append("concept_name", concept);
    }
    formData.append("user_explanation", explanation);
    if (file) {
      formData.append("file", file);
    }

    if (sessionId) {
      formData.append("session_id", sessionId);
    }

    diagnose(formData as any, {
      onSuccess: (data) => {
        if (onComplete) onComplete(data as unknown as Diagnostic);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-bold text-white mb-3"
        >
          Test Your Understanding
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-lg"
        >
          Explain a concept in your own words. AI will find the gaps.
        </motion.p>
      </div>

      <GlassCard className="border-t border-white/10 bg-gradient-to-b from-white/10 to-transparent">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="concept" className="text-white/90 font-medium">Concept Name</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="unknown-concept"
                  checked={unknownConcept}
                  onCheckedChange={(checked) => {
                    setUnknownConcept(checked);
                    if (checked) setConcept("");
                  }}
                  disabled={isPending}
                />
                <Label htmlFor="unknown-concept" className="text-sm text-white/70 cursor-pointer">
                  I don't know the name
                </Label>
              </div>
            </div>
            <Input
              id="concept"
              placeholder={unknownConcept ? "AI will infer the concept..." : "e.g. Photosynthesis, Binary Search, Entropy..."}
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              disabled={isPending || unknownConcept}
              className={`bg-black/20 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20 h-12 text-lg transition-colors ${unknownConcept ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation" className="text-white/90 font-medium">Your Explanation</Label>
            <Textarea
              id="explanation"
              placeholder="Type your explanation here as if you were teaching it to someone else..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              disabled={isPending}
              className="min-h-[200px] bg-black/20 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20 resize-none text-base leading-relaxed p-4"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/90 font-medium">Attach File (Optional)</Label>
            <p className="text-xs text-white/50 mb-2">Supported: PDF, DOCX, Images (Max 10MB)</p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,image/*"
              className="hidden"
            />

            {!file ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="w-full h-12 border-dashed border-white/20 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Document or Image
              </Button>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/10 border border-white/20">
                <div className="flex items-center overflow-hidden">
                  <div className="bg-primary/20 p-2 rounded mr-3">
                    <Upload className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-white truncate max-w-[200px]">{file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending || (!unknownConcept && !concept) || !explanation}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Knowledge Gaps...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze My Explanation
                <ArrowRight className="ml-2 h-5 w-5 opacity-70" />
              </>
            )}
          </Button>
        </form>
      </GlassCard>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-white/30 mt-6"
      >
        Powered by Gemini 2.5 Flash • Context-Aware Analysis
      </motion.p>
    </div >
  );
}
