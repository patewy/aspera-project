import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BookPageProps {
  children: ReactNode;
  className?: string;
  side?: "left" | "right";
  isDark?: boolean;
}

export const BookPage = ({ children, className, side = "right", isDark = false }: BookPageProps) => {
  return (
    <div
      className={cn(
        "relative w-1/2 h-full transition-all duration-500",
        isDark ? "bg-[hsl(var(--notebook-spine))] text-primary" : "bg-[hsl(var(--notebook-bg))] text-[hsl(var(--notebook-text))]",
        side === "left" ? "rounded-l-xl" : "rounded-r-xl",
        className
      )}
      style={{
        boxShadow: side === "left" 
          ? "inset -25px 0 50px rgba(0,0,0,0.25), inset -3px 0 8px rgba(0,0,0,0.15), -10px 0 30px rgba(0,0,0,0.2)" 
          : "inset 25px 0 50px rgba(0,0,0,0.25), inset 3px 0 8px rgba(0,0,0,0.15), 10px 0 30px rgba(0,0,0,0.2)",
        transform: side === "left" ? 'rotateY(2deg)' : 'rotateY(-2deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
};
