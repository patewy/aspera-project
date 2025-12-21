import { useState } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { NoteCard } from "./NoteCard";
import { Button } from "./ui/button";

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

const MAX_VISIBLE_NOTES = 3;

export const FeaturedSidebar = ({ notes, onNoteClick, onRemoveFromFeatured }: FeaturedSidebarProps) => {
  const [showAll, setShowAll] = useState(false);
  
  const visibleNotes = showAll ? notes : notes.slice(0, MAX_VISIBLE_NOTES);
  const hasMore = notes.length > MAX_VISIBLE_NOTES;

  return (
    <aside className="w-80 shrink-0">
      <div className="bg-card rounded-xl p-6 border border-border h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          <h2 className="text-lg font-semibold">Избранное</h2>
          {notes.length > 0 && (
            <span className="text-xs text-muted-foreground ml-auto">
              {notes.length}
            </span>
          )}
        </div>
        <div className="space-y-3 flex-1 overflow-y-auto min-h-0">
          {visibleNotes.length > 0 ? (
            visibleNotes.map((note) => (
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
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-4 text-muted-foreground hover:text-foreground"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Скрыть
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Показать ещё ({notes.length - MAX_VISIBLE_NOTES})
              </>
            )}
          </Button>
        )}
      </div>
    </aside>
  );
};
