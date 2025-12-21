import { User, Star } from "lucide-react";
import BlockHeader from "./BlockHeader";

interface NotePreview {
  id: number;
  name: string;
  description: string;
  starred?: boolean;
}

const CommunityCard = () => {
  const notes: NotePreview[] = [
    { id: 1, name: "name", description: "описание", starred: true },
    { id: 2, name: "name", description: "описание", starred: true },
    { id: 3, name: "name", description: "описание", starred: true },
    { id: 4, name: "name", description: "описание", starred: true },
  ];

  return (
    <div className="h-full bg-card border border-border rounded-[0.75rem] p-6 flex flex-col animate-fade-in-delay-4">
      <BlockHeader title="Сообщество" to="/community" />
      
      <div className="grid grid-cols-2 gap-2 flex-1">
        {notes.map((note) => (
          <div 
            key={note.id} 
            className="bg-muted-foreground/60 rounded-xl p-3 flex flex-col justify-between card-hover cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                <User className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-background font-medium truncate">{note.name}</p>
                <p className="text-xs text-background/70 truncate">{note.description}</p>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <Star 
                className={`w-4 h-4 ${note.starred ? "text-background/60 fill-background/60" : "text-background/40"}`} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityCard;
