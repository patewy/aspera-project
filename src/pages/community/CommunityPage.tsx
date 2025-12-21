import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { SubjectFilter } from "@/components/SubjectFilter";
import { NoteCard } from "@/components/NoteCard";
import { FeaturedSidebar } from "@/components/FeaturedSidebar";
import { TopBar } from "@/components/TopBar";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

const SUBJECTS = [
  "Математический анализ",
  "Химия",
  "Биология",
  "Физика",
  "История",
  "Литература",
];

const FEATURED_NOTES = [
  {
    id: "f1",
    authorName: "Анна Петрова",
    subject: "Математический анализ",
    description: "Производные функций: основные правила и примеры решения задач",
    likes: 142,
    comments: 23,
  },
  {
    id: "f2",
    authorName: "Иван Смирнов",
    subject: "Химия",
    description: "Периодическая система элементов и химические связи",
    likes: 98,
    comments: 15,
  },
  {
    id: "f3",
    authorName: "Мария Иванова",
    subject: "Биология",
    description: "Строение клетки: органоиды и их функции",
    likes: 156,
    comments: 31,
  },
];

const ALL_NOTES = [
  {
    id: "1",
    authorName: "Дмитрий Козлов",
    subject: "Математический анализ",
    description: "Интегралы и методы их вычисления. Подробный разбор основных типов интегралов с примерами",
    likes: 87,
    comments: 12,
  },
  {
    id: "2",
    authorName: "Елена Волкова",
    subject: "Физика",
    description: "Законы Ньютона: теория и практическое применение в решении задач механики",
    likes: 123,
    comments: 19,
  },
  {
    id: "3",
    authorName: "Алексей Морозов",
    subject: "Химия",
    description: "Окислительно-восстановительные реакции: балансировка уравнений и примеры",
    likes: 64,
    comments: 8,
  },
  {
    id: "4",
    authorName: "Ольга Соколова",
    subject: "Биология",
    description: "Фотосинтез: световая и темновая фазы, роль хлорофилла",
    likes: 91,
    comments: 14,
  },
  {
    id: "5",
    authorName: "Павел Новikov",
    subject: "История",
    description: "Французская революция: причины, этапы и последствия",
    likes: 76,
    comments: 11,
  },
  {
    id: "6",
    authorName: "Татьяна Белова",
    subject: "Литература",
    description: "Анализ романа 'Война и мир': основные темы и персонажи",
    likes: 134,
    comments: 27,
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [likedNotes, setLikedNotes] = useState<Set<string>>(new Set());
  const [featuredNotes, setFeaturedNotes] = useState<Set<string>>(
    new Set(FEATURED_NOTES.map(note => note.id))
  );
  const [noteToRemove, setNoteToRemove] = useState<string | null>(null);

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleNoteClick = (id: string) => {
    console.log("Opening note:", id);
    toast({
      title: "Конспект открывается",
      description: "Функция просмотра конспекта будет добавлена позже",
    });
  };

  const handleLikeToggle = (id: string) => {
    setLikedNotes((prev) => {
      const newLikes = new Set(prev);
      if (newLikes.has(id)) {
        newLikes.delete(id);
        toast({
          title: "Лайк убран",
          variant: "default",
        });
      } else {
        newLikes.add(id);
        toast({
          title: "Лайк добавлен",
          variant: "default",
        });
      }
      return newLikes;
    });
  };

  const handleFeaturedToggle = (id: string) => {
    if (featuredNotes.has(id)) {
      setNoteToRemove(id);
    } else {
      setFeaturedNotes((prev) => new Set([...prev, id]));
      toast({
        title: "Добавлено в избранное",
        description: "Конспект теперь отображается в избранном",
      });
    }
  };

  const confirmRemoveFromFeatured = () => {
    if (noteToRemove) {
      setFeaturedNotes((prev) => {
        const newFeatured = new Set(prev);
        newFeatured.delete(noteToRemove);
        return newFeatured;
      });
      toast({
        title: "Убрано из избранного",
        variant: "default",
      });
      setNoteToRemove(null);
    }
  };

  const filteredNotes = ALL_NOTES.filter((note) => {
    const matchesSearch =
      searchQuery === "" ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubjects.length === 0 || selectedSubjects.includes(note.subject);
    return matchesSearch && matchesSubject;
  });

  const currentFeaturedNotes = ALL_NOTES.filter(note => featuredNotes.has(note.id));

  return (
    <div className="min-h-screen bg-background p-4">
      <TopBar />
      
      <div className="flex gap-4 mt-4">
        <FeaturedSidebar 
          notes={currentFeaturedNotes} 
          onNoteClick={handleNoteClick}
          onRemoveFromFeatured={handleFeaturedToggle}
        />
      
      <main className="flex-1 flex flex-col gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <SubjectFilter
              subjects={SUBJECTS}
              selectedSubjects={selectedSubjects}
              onSubjectToggle={handleSubjectToggle}
            />
          </div>
          
          {selectedSubjects.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 animate-fade-in">
              {selectedSubjects.map((subject) => (
                <Badge
                  key={subject}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm hover:bg-secondary/80 transition-all cursor-pointer group animate-scale-in"
                  onClick={() => handleSubjectToggle(subject)}
                >
                  <span>{subject}</span>
                  <X className="h-3 w-3 ml-2 group-hover:scale-110 transition-transform" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                authorName={note.authorName}
                subject={note.subject}
                description={note.description}
                likes={note.likes}
                comments={note.comments}
                isLiked={likedNotes.has(note.id)}
                isFeatured={featuredNotes.has(note.id)}
                onClick={handleNoteClick}
                onLikeToggle={handleLikeToggle}
                onFeaturedToggle={handleFeaturedToggle}
              />
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Конспектов не найдено. Попробуйте изменить параметры поиска.
              </p>
            </div>
          )}
        </div>
      </main>
      </div>

      <AlertDialog open={!!noteToRemove} onOpenChange={(open) => !open && setNoteToRemove(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Убрать из избранного?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Вы уверены, что хотите убрать этот конспект из избранного? Вы всегда сможете добавить его обратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary hover:bg-secondary/80">Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveFromFeatured}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Убрать
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
