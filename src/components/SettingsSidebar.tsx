import { Settings, Plus, Trash2, FileText, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Note {
  id: string;
  title: string;
  folderIds: string[];
  description?: string;
  lastAccessed?: number;
}

interface FolderData {
    id: string; 
    name: string; 
    notes: number;
}

interface SettingsSidebarProps {
  onAddFolder: (name: string, icon: string) => Promise<void>;
  folders: FolderData[];
  onDeleteFolder: (id: string) => void;
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onNoteClick: (noteId: string) => void;
  // Дополнительная логика, если нужно отображать только определенное количество недавних заметок
  maxRecentNotes?: number;
}

export function SettingsSidebar({ 
  onAddFolder, 
  folders, 
  onDeleteFolder,
  notes,
  onDeleteNote,
  onNoteClick,
  maxRecentNotes = 10, // Показываем не более 10 недавних заметок по умолчанию
}: SettingsSidebarProps) {
  
  const recentNotes = notes
    .sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0))
    .slice(0, maxRecentNotes);

  const handleFolderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const name = formData.get("folderName") as string;
      
      // 1. Определяем иконку по умолчанию
      const defaultIcon = "Folder"; 

      if (name.trim()) {
        // 2. ИЗМЕНЕНО: Передаем имя и иконку
        onAddFolder(name.trim(), defaultIcon); 
        e.currentTarget.reset();
      }
  };

  return (
    <>
      <style>{`
        .settings-sidebar-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .settings-sidebar-scroll::-webkit-scrollbar-thumb {
          background-color: #555;
          border-radius: 4px;
        }
      `}</style>
      <div 
        className="h-screen flex flex-col flex-shrink-0 settings-sidebar-scroll"
        style={{ 
          width: "320px",
          background: "#141414",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
          border: "1px solid #333",
          padding: "1rem",
        }}
      >
        <div className="pb-4 border-b border-[#3a3a3a] mb-4">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-white opacity-70" />
            <h2 className="text-xl font-semibold text-white">Настройки</h2>
          </div>
        </div>
        
        {/* 1. Создание папки */}
        <div className="space-y-4 mb-4">
          <form onSubmit={handleFolderSubmit} className="space-y-3">
            <Label htmlFor="folderName" className="text-sm text-white opacity-70">
              Создать новую папку
            </Label>
            <div className="flex gap-2">
              <Input
                id="folderName"
                name="folderName"
                placeholder="Название тематики..."
                className="flex-1 bg-[#222] border-[#3a3a3a] text-white placeholder:text-white/50"
              />
              <Button type="submit" size="icon" className="bg-[#2a2a2a] hover:bg-[#4a4a4a] text-white">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </form>
          <Separator className="bg-[#3a3a3a]" />
        </div>

        <div className="flex-1 overflow-hidden">
          
          {/* 2. Список папок для удаления/управления */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Folder className="w-5 h-5 text-white opacity-70" />
              <h3 className="font-medium text-white">Управление папками ({folders.length})</h3>
            </div>
            <ScrollArea className="h-32 pr-2">
              <div className="space-y-2">
                  {folders.map((folder) => (
                      <div key={folder.id} className="flex items-center justify-between p-2 rounded-lg bg-[#222] border border-[#3a3a3a] group">
                          <span className="text-sm text-white truncate flex-1">{folder.name} ({folder.notes})</span>
                          <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => onDeleteFolder(folder.id)}
                              className="opacity-100 transition-opacity hover:bg-[#dc3545]/20 hover:text-[#dc3545] text-white h-6 w-6"
                              title={`Удалить папку "${folder.name}"`}
                          >
                              <Trash2 className="w-3 h-3" />
                          </Button>
                      </div>
                  ))}
                  {folders.length === 0 && (
                      <p className="text-sm text-white/50 text-center py-2">Нет созданных папок</p>
                  )}
              </div>
            </ScrollArea>
          </div>
          
          <Separator className="bg-[#3a3a3a] mb-4" />

          {/* 3. Недавние конспекты */}
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-white opacity-70" />
            <h3 className="font-medium text-white">Недавние конспекты ({recentNotes?.length || 0})</h3>
          </div>
          <ScrollArea className="h-[calc(100vh-500px)]"> 
            <div className="space-y-2 pr-2">
              {/* 🛑 ИСПРАВЛЕНИЕ 1: Защищаем recentNotes перед map() */}
              {(recentNotes || []).map((note) => { 
                
                // 🛑 ИСПРАВЛЕНИЕ 2: Защищаем note.folderIds перед map()
                const noteFolders = (note.folderIds || []) 
                  .map((folderId) => folders.find((f) => f.id === folderId)?.name)
                  .filter(Boolean);
                
                return (
                  <div 
                    key={note.id}
                    onClick={() => onNoteClick(note.id)}
                    className="flex flex-col p-3 rounded-lg bg-[#222] border border-[#3a3a3a] hover:border-[#4a4a4a] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-medium text-white truncate flex-1">{note.title}</p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNote(note.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#dc3545]/20 hover:text-[#dc3545] text-white h-6 w-6"
                        title="Удалить конспект"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    {note.description && (
                      <p className="text-xs text-white/50 truncate mb-2">
                        {note.description}
                      </p>
                    )}
                    {noteFolders.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {noteFolders.map((folderName, idx) => (
                          <span key={idx} className="text-xs text-white/40 bg-[#2a2a2a] px-2 py-0.5 rounded">
                            {folderName}
                          </span>
                        ))}
                      </div>
                    )}
                    {note.lastAccessed && (
                      <p className="text-xs text-white/30 mt-2">
                        Открыт {new Date(note.lastAccessed).toLocaleDateString("ru-RU", { 
                          day: "numeric", 
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    )}
                  </div>
                );
              })}
              {recentNotes.length === 0 && (
                <p className="text-sm text-white/50 text-center py-8">
                  Нет недавних конспектов
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}