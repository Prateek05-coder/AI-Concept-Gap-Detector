import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { DiagnosisForm } from "@/components/dashboard/diagnosis-form";
import { ResultsView } from "@/components/dashboard/results-view";
import { useHistory } from "@/hooks/use-diagnostics";
import { Diagnostic } from "@shared/schema";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  const { data: history } = useHistory();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnostic | null>(null);
  const [continuationContext, setContinuationContext] = useState<{ concept: string; sessionId: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Common main content
  const MainContent = (
    <main className="flex-1 relative overflow-hidden flex flex-col h-full bg-background">
      {/* Background blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
        <AnimatePresence mode="wait">
          {selectedDiagnosis ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ResultsView
                data={selectedDiagnosis}
                onReset={() => {
                  setSelectedDiagnosis(null);
                  setContinuationContext(null);
                }}
                onContinue={() => {
                  setContinuationContext({
                    concept: selectedDiagnosis.conceptName || "",
                    sessionId: selectedDiagnosis.sessionId
                  });
                  setSelectedDiagnosis(null);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col items-center justify-center min-h-[500px]"
            >
              <DiagnosisForm
                onComplete={setSelectedDiagnosis}
                initialConcept={continuationContext?.concept}
                sessionId={continuationContext?.sessionId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background relative">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <Button size="icon" variant="outline" className="bg-black/50 border-white/20 text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay (Fixed) */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar
          currentDiagnosisId={selectedDiagnosis?.id}
          onSelectHistory={(item) => {
            setSelectedDiagnosis(item);
            setSidebarOpen(false);
          }}
          onNewDiagnosis={() => {
            setSelectedDiagnosis(null);
            setContinuationContext(null);
            setSidebarOpen(false);
          }}
          className="w-80" // Fixed width for mobile
        />
      </div>

      {/* Mobile Main Content */}
      <div className="flex-1 md:hidden h-full flex flex-col">
        {MainContent}
      </div>

      {/* Desktop Resizable Layout */}
      <div className="hidden md:flex w-full h-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={40} className="min-w-[250px]">
            <Sidebar
              currentDiagnosisId={selectedDiagnosis?.id}
              onSelectHistory={setSelectedDiagnosis}
              onNewDiagnosis={() => {
                setSelectedDiagnosis(null);
                setContinuationContext(null);
              }}
              className="w-full relative border-r border-white/10" // Flexible width for desktop
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            {MainContent}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}


