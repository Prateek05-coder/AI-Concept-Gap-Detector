import { useHealth, useHistory, useDeleteDiagnostic } from "@/hooks/use-diagnostics";
import { UserProfile } from "@/components/external/UserProfile";
import { cn } from "@/lib/utils";
import { Activity, BrainCircuit, History, Trash2, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Diagnostic } from "@shared/schema";

interface SidebarProps {
  currentDiagnosisId?: number;
  onSelectHistory: (diagnostic: Diagnostic) => void;
  onNewDiagnosis: () => void;
  className?: string;
}

export function Sidebar({ currentDiagnosisId, onSelectHistory, onNewDiagnosis, className }: SidebarProps) {
  const { data: health } = useHealth();
  const { data: history } = useHistory();
  const { mutate: deleteDiagnostic, isPending: isDeleting } = useDeleteDiagnostic();

  const isGeminiConnected = health?.gemini_status === "connected";

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this session?")) {
      deleteDiagnostic(id);
    }
  };

  return (
    <div className={cn("h-full w-full flex flex-col glass-panel rounded-r-2xl border-l-0 border-y-0 fixed md:relative z-20", className)}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={onNewDiagnosis}>
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight text-white">
            Learning<br />Debugger
          </h1>
        </div>

        {/* Health Status */}
        <div className="flex items-center gap-2 text-xs font-medium bg-black/20 p-3 rounded-lg border border-white/5">
          <div className="flex items-center gap-2 flex-1">
            <Activity className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">API Status</span>
          </div>
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded-full",
            health?.status === "healthy" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", health?.status === "healthy" ? "bg-green-400" : "bg-red-400")} />
            {health?.status === "healthy" ? "Online" : "Offline"}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium bg-black/20 p-3 rounded-lg border border-white/5 mt-2">
          <div className="flex items-center gap-2 flex-1">
            {isGeminiConnected ? <Wifi className="w-3.5 h-3.5 text-muted-foreground" /> : <WifiOff className="w-3.5 h-3.5 text-muted-foreground" />}
            <span className="text-muted-foreground">AI Engine</span>
          </div>
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded-full",
            isGeminiConnected ? "bg-accent/10 text-accent" : "bg-red-500/10 text-red-400"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", isGeminiConnected ? "bg-accent" : "bg-red-400")} />
            {isGeminiConnected ? "Ready" : "Error"}
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 px-6 pb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <History className="w-3.5 h-3.5" />
            Session History
          </h2>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 pb-4">
            {!history?.length ? (
              <div className="text-center py-8 px-4">
                <p className="text-sm text-muted-foreground italic">No diagnostics yet.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Submit your first explanation to see results here.</p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "w-full text-left p-3 rounded-xl transition-all duration-200 border text-sm group relative",
                    currentDiagnosisId === item.id
                      ? "bg-primary/20 border-primary/30 text-white shadow-lg shadow-primary/10"
                      : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/10 hover:text-white"
                  )}
                  onClick={() => onSelectHistory(item)}
                  role="button"
                >
                  <div className="font-medium truncate pr-8">{item.conceptName}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] opacity-70">
                      {item.createdAt ? format(new Date(item.createdAt), 'MMM d, h:mm a') : 'Unknown date'}
                    </span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                      (item.confidence || 0) > 70 ? "bg-green-500/20 text-green-400" :
                        (item.confidence || 0) > 40 ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                    )}>
                      {item.confidence}%
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="absolute top-3 right-2 p-1.5 rounded-md text-muted-foreground/50 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    title="Delete session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <UserProfile />
    </div>
  );
}
