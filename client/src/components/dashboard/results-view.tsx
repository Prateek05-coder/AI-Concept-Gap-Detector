import { Diagnostic } from "@shared/schema";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { AlertCircle, BookOpen, CheckCircle, HelpCircle, Lightbulb, Target, ArrowUpRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ResultsViewProps {
  data: Diagnostic;
  onReset?: () => void;
  onContinue?: () => void;
}

export function ResultsView({ data, onReset, onContinue }: ResultsViewProps) {
  const confidenceData = [
    { name: 'Confidence', value: data.confidence || 0 },
    { name: 'Remaining', value: 100 - (data.confidence || 0) },
  ];

  const prerequisites = (data.missingPrerequisites as string[]) || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Analysis Result</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-white mb-2">{data.conceptName}</h2>
          <p className="text-white/60">Analyzed on {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Just now'}</p>
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
          >
            Start New Diagnosis
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards */}
        <GlassCard className="flex flex-col items-center justify-center min-h-[220px]">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-widest mb-4">Confidence Score</h3>
          <div className="h-[120px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confidenceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={55}
                  startAngle={180}
                  endAngle={0}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? `hsl(${280 + (data.confidence! > 80 ? 0 : data.confidence! < 50 ? -20 : -10)}, 85%, 70%)` : 'rgba(255,255,255,0.1)'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10%] text-center">
              <span className="text-3xl font-bold text-white block">{data.confidence}%</span>
            </div>
          </div>
          <p className="text-xs text-center text-white/40 mt-2">Based on detail & accuracy</p>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center min-h-[220px]">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-widest mb-4">Knowledge Coverage</h3>
          <div className="w-full px-4">
            <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.knowledgeCoverage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
            <div className="flex justify-between text-xs text-white/40">
              <span>Surface Level</span>
              <span>Comprehensive</span>
            </div>
          </div>
          <div className="mt-6 text-center">
            <span className="text-3xl font-bold text-white">{data.knowledgeCoverage}%</span>
            <p className="text-xs text-white/40 mt-1">Topic coverage detected</p>
          </div>
        </GlassCard>

        <GlassCard className="md:col-span-1 flex flex-col justify-start">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            Missing Prerequisites
          </h3>
          {prerequisites.length > 0 ? (
            <ul className="space-y-3">
              {prerequisites.map((req, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 text-sm text-white/80 bg-white/5 p-3 rounded-lg border border-white/5"
                >
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                  {req}
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <CheckCircle className="w-8 h-8 text-green-400 mb-2 opacity-50" />
              <p className="text-sm text-white/60">No major prerequisites missing!</p>
            </div>
          )}
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Root Cause Analysis */}
        <GlassCard className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
          <h3 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-400" />
            Root Cause Analysis
          </h3>
          <p className="text-white/80 leading-relaxed text-lg">
            {data.rootCause}
          </p>
        </GlassCard>

        {/* Repair Question */}
        <GlassCard className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <h3 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            Repair Question
          </h3>
          <div className="bg-black/20 p-5 rounded-xl border border-white/10">
            <p className="text-white font-medium text-lg italic">
              "{data.repairQuestion}"
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-300/80">
            <Lightbulb className="w-4 h-4" />
            <span>Try to answer this to bridge your knowledge gap.</span>
          </div>
        </GlassCard>

        {/* Learning Resources */}
        <GlassCard className="md:col-span-2">
          <h3 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            Recommended Learning Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.learningResources?.map((resource, i) => (
              <a
                key={i}
                href={resource.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1 block">{resource.type}</span>
                    <h4 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors mb-1">{resource.title}</h4>
                    <p className="text-sm text-white/60 line-clamp-2">{resource.relevance}</p>
                  </div>
                  {resource.url && <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white" />}
                </div>
              </a>
            ))}
            {(!data.learningResources || data.learningResources.length === 0) && (
              <p className="text-white/40 italic text-sm p-4">No specific resources generated for this diagnosis.</p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Original Explanation (for reference) */}
      <div className="pt-8 border-t border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-white/40 uppercase">Your Explanation</h4>
          {onContinue && (
            <div className="flex gap-2">
              <button
                onClick={onContinue}
                className="text-xs text-primary hover:text-white transition-colors"
              >
                Refine / Continue Session
              </button>
            </div>
          )}
        </div>
        <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-white/60 text-sm">
          {data.userExplanation}
        </div>
      </div>
    </div>
  );
}
