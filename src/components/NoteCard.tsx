import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Heart, MessageCircle, Star } from "lucide-react";

interface NoteCardProps {
  authorName: string;
  authorAvatar?: string;
  subject: string;
  description: string;
  isFeatured?: boolean;
  likes?: number;
  comments?: number;
  id: string;
  isLiked?: boolean;
  onClick?: (id: string) => void;
  onLikeToggle?: (id: string) => void;
  onFeaturedToggle?: (id: string) => void;
}

const getColorForSubject = (subject: string) => {
  const colors = [
    "from-violet-500/20 to-purple-500/20 border-t-violet-500/50",
    "from-blue-500/20 to-cyan-500/20 border-t-blue-500/50",
    "from-emerald-500/20 to-green-500/20 border-t-emerald-500/50",
    "from-amber-500/20 to-orange-500/20 border-t-amber-500/50",
    "from-rose-500/20 to-pink-500/20 border-t-rose-500/50",
    "from-indigo-500/20 to-blue-500/20 border-t-indigo-500/50",
  ];
  const hash = subject.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const NoteCard = ({ 
  authorName, 
  authorAvatar, 
  subject, 
  description,
  isFeatured = false,
  likes = 0,
  comments = 0,
  id,
  isLiked = false,
  onClick,
  onLikeToggle,
  onFeaturedToggle
}: NoteCardProps) => {
  const colorClass = getColorForSubject(subject);
  
  const handleCardClick = () => {
    onClick?.(id);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeToggle?.(id);
  };

  const handleFeaturedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFeaturedToggle?.(id);
  };

  return (
    <Card 
      className="card-hover cursor-pointer border-border overflow-hidden group"
      onClick={handleCardClick}
    >
      <div className={`h-24 bg-gradient-to-br ${colorClass} border-t-2 animate-fade-in relative`}>
        <div 
          className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full p-1.5 animate-scale-in cursor-pointer hover:scale-110 transition-transform"
          onClick={handleFeaturedClick}
        >
          <Star className={`h-4 w-4 transition-all ${isFeatured ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground hover:text-amber-400'}`} />
        </div>
      </div>
      <CardHeader className="space-y-3 -mt-8 relative z-10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-background">
            <AvatarImage src={authorAvatar} alt={authorName} />
            <AvatarFallback className="bg-muted text-muted-foreground">
              {authorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{authorName}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              <span className="truncate">{subject}</span>
            </div>
          </div>
        </div>
        {!isFeatured && <CardTitle className="text-lg">{subject}</CardTitle>}
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="line-clamp-3">{description}</CardDescription>
        
        <div className="flex items-center gap-4 pt-2 border-t border-border/50">
          <button 
            onClick={handleLikeClick}
            className="flex items-center gap-1.5 transition-colors group/like hover:scale-105 transition-transform"
          >
            <Heart className={`h-4 w-4 transition-all ${isLiked ? 'text-rose-400 fill-rose-400' : 'text-muted-foreground hover:text-rose-400'}`} />
            <span className={`text-sm ${isLiked ? 'text-rose-400' : 'text-muted-foreground'}`}>{likes + (isLiked ? 1 : 0)}</span>
          </button>
          <div className="flex items-center gap-1.5 text-muted-foreground hover:text-blue-400 transition-colors group/comment">
            <MessageCircle className="h-4 w-4 group-hover/comment:scale-110 transition-transform" />
            <span className="text-sm">{comments}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
