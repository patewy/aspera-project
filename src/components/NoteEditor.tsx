import { useRef, useState } from "react";
import { ArrowLeft, ChevronDown, Globe, Lock, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Editor } from "@tinymce/tinymce-react";

interface Note {
  id: string;
  title: string;
  folderIds: string[];
  description?: string;
  content?: string;
  lastAccessed?: number;
  icon?: string;
  isPublic: boolean;
}

interface NoteEditorProps {
  note: Note;
  folders: Array<{ id: string; name: string }>;
  onSave: (noteId: string, content: string, newFolderIds: string[], isPublic: boolean) => void;
  onDelete: (noteId: string) => void;
  onClose: () => void;
}

export function NoteEditor({ note, folders, onSave, onDelete, onClose }: NoteEditorProps) {
  const editorRef = useRef<any>(null);
  const [content, setContent] = useState(note.content || "");
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>(note.folderIds || []);
  const [isPublic, setIsPublic] = useState(note.isPublic || false);

  const handleSave = () => {
    // Получаем актуальный контент из TinyMCE через ref
    const htmlContent = editorRef.current ? editorRef.current.getContent() : content;
    
    onSave(note.id, htmlContent, selectedFolderIds, isPublic);
    toast.success(`Конспект "${note.title}" успешно сохранен!`);
  };

  const handleDelete = () => {
    if (confirm(`Вы уверены, что хотите удалить конспект "${note.title}"?`)) {
      onDelete(note.id);
      onClose();
    }
  };

  const toggleFolder = (folderId: string) => {
    if (folderId && !selectedFolderIds.includes(folderId)) {
      setSelectedFolderIds([...selectedFolderIds, folderId]);
    }
  };

  const removeFolder = (folderId: string) => {
    setSelectedFolderIds(selectedFolderIds.filter(id => id !== folderId));
  };

  return (
    <div className="relative flex h-screen w-full bg-[#000] text-white overflow-hidden">
      <style>{`
        .note-editor-container { display: flex; width: 100%; max-width: 1400px; height: 100vh; padding: 20px; margin: 0 auto; }
        .note-editor-sidebar { width: 320px; background: #141414; border-radius: 12px; border: 1px solid #333; padding: 1.5rem; display: flex; flex-direction: column; gap: 20px; margin-right: 20px; flex-shrink: 0; }
        .note-editor-pane { flex-grow: 1; background-color: #fafafa; color: #1f1f1f; border-radius: 18px; padding: 40px; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .note-editor-title { text-align: center; font-size: 2.2rem; font-weight: 700; margin-bottom: 8px; color: #111; }
        
        .privacy-card {
          background: #1f1f1f;
          border: 1px solid #333;
          border-radius: 10px;
          padding: 12px;
          transition: border-color 0.3s;
        }
        .privacy-card.is-public { border-color: #22c55e; }
        
        .folder-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          background: #3b82f6;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
      `}</style>

      <div className="note-editor-container">
        {/* Боковая панель управления */}
        <aside className="note-editor-sidebar">
          <Button onClick={onClose} variant="outline" className="w-full border-[#333] hover:bg-[#222] text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Назад к списку
          </Button>

          <div className="flex flex-col gap-6 overflow-y-auto pr-1">
            
            {/* Настройки приватности */}
            <div className="space-y-2">
              <h4 className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Доступ</h4>
              <div 
                className={`privacy-card cursor-pointer flex items-center justify-between ${isPublic ? 'is-public' : ''}`}
                onClick={() => setIsPublic(!isPublic)}
              >
                <div className="flex items-center gap-3">
                  {isPublic ? <Globe className="w-5 h-5 text-green-500" /> : <Lock className="w-5 h-5 text-gray-400" />}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{isPublic ? "Публичный" : "Приватный"}</span>
                    <span className="text-[10px] text-gray-500">{isPublic ? "Виден всем" : "Только вам"}</span>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${isPublic ? 'bg-green-600' : 'bg-gray-700'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isPublic ? 'right-1' : 'left-1'}`} />
                </div>
              </div>
            </div>

            {/* Выбор папок */}
            <div className="space-y-3">
              <h4 className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Тематические папки</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedFolderIds.map(id => (
                  <span key={id} className="folder-tag">
                    {folders.find(f => f.id === id)?.name || "Папка"}
                    <button onClick={() => removeFolder(id)} className="hover:text-red-300">×</button>
                  </span>
                ))}
                {selectedFolderIds.length === 0 && <span className="text-xs text-gray-600 italic">Папки не выбраны</span>}
              </div>
              <div className="relative">
                <select 
                  className="w-full bg-[#1f1f1f] border border-[#333] rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                  onChange={(e) => toggleFolder(e.target.value)}
                  value=""
                >
                  <option value="" disabled>Добавить в папку...</option>
                  {folders
                    .filter(f => !selectedFolderIds.includes(f.id))
                    .map(f => <option key={f.id} value={f.id}>{f.name}</option>)
                  }
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Кнопки действий внизу */}
          <div className="mt-auto pt-4 space-y-2 border-t border-[#333]">
            <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5">
              <Save className="mr-2 h-4 w-4" /> Сохранить
            </Button>
            <Button onClick={handleDelete} variant="ghost" className="w-full text-gray-500 hover:text-red-500 hover:bg-red-500/10">
              <Trash2 className="mr-2 h-4 w-4" /> Удалить конспект
            </Button>
          </div>
        </aside>

        {/* Основная панель редактора */}
        <main className="note-editor-pane">
          <header className="mb-6">
            <h1 className="note-editor-title">{note.title}</h1>
            <div className="flex justify-center items-center gap-2 text-gray-400 text-xs uppercase tracking-widest">
              <span>Режим редактирования</span>
              {isPublic && <span className="bg-green-500/10 text-green-600 px-2 py-0.5 rounded border border-green-500/20">Public</span>}
            </div>
          </header>

          <Editor
            apiKey="vhtlvej7a1b638hcuweri8zgcalgijwllzcps13kt0btydv0"
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={note.content}
            init={{
              height: 'calc(100vh - 280px)',
              menubar: 'edit insert format table help',
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | image link',
              content_style: `
                body { 
                  font-family: 'Courier Prime', monospace; 
                  font-size: 16px; 
                  line-height: 1.6; 
                  color: #333;
                  max-width: 900px;
                  margin: 20px auto;
                }
              `,
              skin: 'oxide',
              language: 'ru',
              branding: false,
              promotion: false
            }}
            onEditorChange={(newContent) => setContent(newContent)}
          />
        </main>
      </div>
    </div>
  );
}