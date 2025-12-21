import { useState } from "react";
// Импортируем иконки для UI и для выбора папок
import { 
  Plus, ZoomIn, ZoomOut, Maximize2, FolderPlus, 
  // Новые иконки для папок
  Folder, Code, Book, Atom, Zap, Feather, Package, Heart, Lightbulb, GraduationCap 
} from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LucideIcon } from "lucide-react";

const NOTE_DESCRIPTION_LIMIT = 100;

interface TouchBarProps {
  folders: Array<{ id: string; name: string }>;
  // onAddNote возвращен к исходному формату (без icon)
  onAddNote: (title: string, folderIds: string[], description?: string) => void;
  // ИЗМЕНЕНО: onAddFolder теперь принимает необязательный icon
  onAddFolder: (name: string, icon?: string) => void; 
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
}

// 1. Определяем список иконок для выбора папок
const folderIconOptions: Array<{ name: string; component: LucideIcon }> = [
  { name: "Folder", component: Folder },
  { name: "Code", component: Code },
  { name: "Book", component: Book },
  { name: "GraduationCap", component: GraduationCap },
  { name: "Lightbulb", component: Lightbulb },
  { name: "Atom", component: Atom },
  { name: "Zap", component: Zap },
  { name: "Feather", component: Feather },
  { name: "Package", component: Package },
  { name: "Heart", component: Heart },
];

export function TouchBar({ folders, onAddNote, onAddFolder, onZoomIn, onZoomOut, onResetView }: TouchBarProps) {
  // Состояния для создания конспекта (не изменились)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  
  // Состояния для создания папки
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState(""); 
  // 2. НОВОЕ СОСТОЯНИЕ: Значок папки по умолчанию
  const [folderIconName, setFolderIconName] = useState(folderIconOptions[0].name); 

  const handleFolderToggle = (folderId: string, checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    if (isChecked) {
      if (!selectedFolders.includes(folderId)) {
        setSelectedFolders([...selectedFolders, folderId]);
      }
    } else {
      setSelectedFolders(selectedFolders.filter((id) => id !== folderId));
    }
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || selectedFolders.length === 0) return;

    // onAddNote вернулся к старому формату
    onAddNote(noteTitle.trim(), selectedFolders, noteDescription.trim() || undefined); 
    
    setNoteTitle("");
    setNoteDescription("");
    setSelectedFolders([]);
    setIsNoteModalOpen(false);
  };

  const handleNoteClose = () => {
    setIsNoteModalOpen(false);
    setNoteTitle("");
    setNoteDescription("");
    setSelectedFolders([]);
  };

  // 3. ОБНОВЛЕН: handleFolderSubmit для передачи значка
  const handleFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = folderName.trim(); 
    
    if (!name) return;
    
    // Передаем выбранное имя значка
    onAddFolder(name, folderIconName); 
    
    setFolderName("");
    setFolderIconName(folderIconOptions[0].name); // Сброс значка
    setIsFolderModalOpen(false);
  };

  // Компонент для отображения выбранной иконки папки
  const SelectedFolderIconComponent = folderIconOptions.find(opt => opt.name === folderIconName)?.component || Folder;

  return (
    <>
      {/* ... (TouchBar UI) ... */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-[#141414] border border-[#333] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] px-3 py-2 flex items-center gap-2">
          
          {/* Кнопка: Новый конспект */}
          <Button
            onClick={() => setIsNoteModalOpen(true)}
            className="bg-[#2a2a2a] hover:bg-[#4a4a4a] text-white rounded-full px-4 py-2 h-auto shadow-lg transition-all"
            title="Новый конспект"
          >
            <Plus className="w-5 h-5" />
          </Button>

          {/* Кнопка: Новая папка */}
          <Button
            onClick={() => setIsFolderModalOpen(true)} 
            className="bg-[#2a2a2a] hover:bg-[#4a4a4a] text-white rounded-full px-4 py-2 h-auto shadow-lg transition-all"
            title="Новая папка"
          >
            <FolderPlus className="w-5 h-5" />
          </Button>
          
          <div className="w-px h-8 bg-[#333] mx-1" />
          
          {/* Кнопки управления видом */}
          {onZoomIn && (
            <Button
              onClick={onZoomIn}
              className="bg-[#2a2a2a] hover:bg-[#4a4a4a] text-white rounded-full px-4 py-2 h-auto shadow-lg transition-all"
              title="Увеличить"
            >
              <ZoomIn className="w-5 h-5" />
            </Button>
          )}
          
          {onZoomOut && (
            <Button
              onClick={onZoomOut}
              className="bg-[#2a2a2a] hover:bg-[#4a4a4a] text-white rounded-full px-4 py-2 h-auto shadow-lg transition-all"
              title="Уменьшить"
            >
              <ZoomOut className="w-5 h-5" />
            </Button>
          )}
          
          {onResetView && (
            <Button
              onClick={onResetView}
              className="bg-[#2a2a2a] hover:bg-[#4a4a4a] text-white rounded-full px-4 py-2 h-auto shadow-lg transition-all"
              title="Сбросить вид"
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. Модальное окно: Создать конспект (Без изменений) */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
        <DialogContent className="max-w-2xl bg-[#141414] border-[#333] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Создать новый конспект</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNoteSubmit} className="space-y-4">
            {/* Поле названия */}
            <div className="space-y-2">
              <Label htmlFor="noteTitle" className="text-sm text-white opacity-70">
                Название конспекта
              </Label>
              <Input
                id="noteTitle"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Введите название..."
                className="bg-[#222] border-[#3a3a3a] text-white placeholder:text-white/50"
                required
              />
            </div>

            {/* Поле описания */}
            <div className="space-y-2">
              <Label htmlFor="noteDescription" className="text-sm text-white opacity-70">
                Краткая информация (необязательно)
              </Label>
              <Textarea
                id="noteDescription"
                value={noteDescription}
                onChange={(e) => setNoteDescription(e.target.value.slice(0, NOTE_DESCRIPTION_LIMIT))}
                placeholder="Пара предложений о содержании..."
                maxLength={NOTE_DESCRIPTION_LIMIT}
                className="bg-[#222] border-[#3a3a3a] text-white placeholder:text-white/50 min-h-[90px]"
              />
              <p className="text-[11px] text-white/50 text-right">
                {noteDescription.length}/{NOTE_DESCRIPTION_LIMIT}
              </p>
            </div>

            {/* Выбор папки */}
            <div className="space-y-2">
              <Label className="text-sm text-white opacity-70">Выберите папки</Label>
              <ScrollArea className="h-32 rounded-md border border-[#3a3a3a] p-3 bg-[#222]">
                <div className="space-y-2">
                  {folders.map((folder) => (
                    <label key={folder.id} className="flex items-center gap-2 text-sm text-white cursor-pointer">
                      <Checkbox
                        checked={selectedFolders.includes(folder.id)}
                        onCheckedChange={(checked) => handleFolderToggle(folder.id, checked)}
                      />
                      <span className="truncate">{folder.name}</span>
                    </label>
                  ))}
                  {folders.length === 0 && (
                    <p className="text-sm text-white/50 text-center">Создайте хотя бы одну папку</p>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleNoteClose}
                className="text-white hover:bg-[#2a2a2a]"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={!noteTitle.trim() || selectedFolders.length === 0}
                className="bg-[#007bff] hover:bg-[#0056b3] text-white"
              >
                Создать
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* ---------------------------------------------------- */}
      {/* 3. Модальное окно: Создать папку (С ИКОНКАМИ) */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
        <DialogContent className="max-w-sm bg-[#141414] border-[#333] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Создать новую папку</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFolderSubmit} className="space-y-4"> 
            
            {/* НОВОЕ ПОЛЕ: Выбор значка папки */}
            <div className="space-y-2">
              <Label className="text-sm text-white opacity-70 flex items-center">
                Значок папки: <SelectedFolderIconComponent className="w-6 h-6 ml-2 text-white" />
              </Label>
              <div className="flex flex-wrap gap-2 p-2 rounded-md border border-[#3a3a3a] bg-[#222]">
                {folderIconOptions.map((icon) => {
                    const IconComponent = icon.component;
                    return (
                        <button
                            key={icon.name}
                            type="button"
                            onClick={() => setFolderIconName(icon.name)}
                            className={`p-2 rounded-md transition-all text-white/80 border ${
                              folderIconName === icon.name 
                                ? 'bg-[#007bff] ring-2 ring-[#007bff]/50 border-[#007bff]' 
                                : 'hover:bg-[#444] border-transparent'
                            }`}
                            title={icon.name}
                        >
                            <IconComponent className="w-5 h-5" />
                        </button>
                    );
                })}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="folderNameTouchbar" className="text-sm text-white opacity-70">
                Название папки
              </Label>
              <Input
                id="folderNameTouchbar"
                value={folderName} 
                onChange={(e) => setFolderName(e.target.value)} 
                placeholder="Например: Математика, Проекты..."
                className="bg-[#222] border-[#3a3a3a] text-white placeholder:text-white/50"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsFolderModalOpen(false)}
                className="text-white hover:bg-[#2a2a2a]"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={!folderName.trim()} 
                className="bg-[#007bff] hover:bg-[#0056b3] text-white"
              >
                Создать
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}