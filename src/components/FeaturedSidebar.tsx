import { Star } from "lucide-react";
import { NoteCard } from "./NoteCard";

interface FeaturedNote {
  id: string;
  authorName: string;
  authorAvatar?: string;
  subject: string;
  description: string;
  likes?: number;
  comments?: number;
}

interface FeaturedSidebarProps {
  notes: FeaturedNote[];
  onNoteClick: (id: string) => void;
  onRemoveFromFeatured: (id: string) => void;
}

export const FeaturedSidebar = ({ notes, onNoteClick, onRemoveFromFeatured }: FeaturedSidebarProps) => {
  return (
    <aside className="w-80 p-4 self-stretch">
      <div className="bg-card rounded-xl p-6 space-y-4 border border-border h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          <h2 className="text-lg font-semibold">Избранное</h2>
        </div>
        <div className="space-y-4 flex-1 overflow-y-auto">
          {notes.length > 0 ? (
            notes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                authorName={note.authorName}
                authorAvatar={note.authorAvatar}
                subject={note.subject}
                description={note.description}
                likes={note.likes}
                comments={note.comments}
                isFeatured
                onClick={onNoteClick}
                onFeaturedToggle={onRemoveFromFeatured}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Нет избранных конспектов</p>
              <p className="text-xs mt-2">Добавьте конспекты в избранное, нажав на звёздочку</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
