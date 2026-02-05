import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  variant?: "default" | "interactive";
}

export function GlassCard({ children, className, variant = "default", ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl p-6 border transition-all duration-300",
        variant === "default" 
          ? "glass-panel" 
          : "glass-card hover:translate-y-[-2px] hover:shadow-primary/20",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
