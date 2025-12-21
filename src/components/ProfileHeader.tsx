import { User, Copy } from "lucide-react";

const ProfileHeader = () => {
  return (
    <div className="relative bg-card border border-border rounded-[0.75rem] p-6 overflow-hidden">
      {/* Decorative Background with Nodes */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute top-0 right-0 w-3/4 h-full opacity-30"
          viewBox="0 0 400 200"
          fill="none"
        >
          {/* Node connections */}
          <line x1="100" y1="60" x2="180" y2="40" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          <line x1="180" y1="40" x2="260" y2="80" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          <line x1="260" y1="80" x2="320" y2="50" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          <line x1="260" y1="80" x2="300" y2="120" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          <line x1="300" y1="120" x2="370" y2="100" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          <line x1="180" y1="40" x2="220" y2="90" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          
          {/* Nodes */}
          <circle cx="100" cy="60" r="8" fill="hsl(var(--muted-foreground))" />
          <circle cx="180" cy="40" r="10" fill="hsl(var(--muted-foreground))" />
          <circle cx="260" cy="80" r="14" fill="hsl(var(--muted-foreground))" />
          <circle cx="320" cy="50" r="12" fill="hsl(var(--muted-foreground))" />
          <circle cx="300" cy="120" r="8" fill="hsl(var(--muted-foreground))" />
          <circle cx="370" cy="100" r="10" fill="hsl(var(--muted-foreground))" />
          <circle cx="220" cy="90" r="6" fill="hsl(var(--muted-foreground))" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-center gap-4">
          {/* Avatar with accent border */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-accent flex items-center justify-center bg-secondary">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
            {/* Online indicator dots */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/60" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-foreground">name</h1>
            {/* Status bar */}
            <div className="mt-3 h-3 w-48 bg-secondary rounded-full" />
          </div>

          {/* Copy button */}
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <Copy className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
