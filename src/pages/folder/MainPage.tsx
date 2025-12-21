import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { SettingsSidebar } from "@/components/SettingsSidebar";
import { GraphView, GraphViewRef } from "@/components/GraphView";
import { NoteEditor } from "@/components/NoteEditor";
import { TouchBar } from "@/components/TouchBar";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { 
    fetchAllFolders, 
    createFolder, 
    transformToNode,
    deleteFolder,
} from '@/services/folderService'; 

import { 
    updateNoteAPI, 
    deleteNoteAPI, 
    createNoteAPI, 
    fetchAllNotes, 
} from '@/services/noteService';

export interface Node {
  id: string;
  name: string;
  notes: number;
  x?: number;
  y?: number;
  icon?: string; 
}

type NodePosition = {
  x: number;
  y: number;
};

interface Link {
  source: string;
  target: string;
  weight: number;
}

const NOTE_DESCRIPTION_LIMIT = 100;

export interface Note {
  id: string;
  title: string;
  folderIds: string[];
  description?: string;
  content?: string;
  lastAccessed?: number;
  isPublic: boolean;
}

// ------------------------------------------------
// ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ID ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
// ------------------------------------------------
const getCurrentUserId = (): string | null => {
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;

  try {
    const user = JSON.parse(userJson);
    // Подстраиваем под формат ответа от /auth/login
    // Если у тебя поле называется по-другому — измени здесь
    return user.id || user.userId || user.uuid || null;
  } catch (e) {
    console.error("Ошибка парсинга пользователя из localStorage", e);
    return null;
  }
};

// ------------------------------------------------
// ФУНКЦИЯ ДЛЯ ПЕРЕСЧЕТА СВЯЗЕЙ (Вынесена для чистоты)
// ------------------------------------------------
const calculateLinks = (notes: Note[]): Link[] => {
  const linkMap = new Map<string, number>(); 
    
  notes.forEach(note => {
    const validFolderIds = note.folderIds || []; 
    const folderIds = [...validFolderIds].sort();
    
    if (folderIds.length < 2) {
      return;
    }
    
    for (let i = 0; i < folderIds.length; i++) {
      for (let j = i + 1; j < folderIds.length; j++) {
        const sourceId = folderIds[i];
        const targetId = folderIds[j];
        const key = `${sourceId}_${targetId}`;

        linkMap.set(key, (linkMap.get(key) || 0) + 1);
      }
    }
  });

  const links: Link[] = [];
  for (const [key, weight] of linkMap.entries()) {
    const [source, target] = key.split('_');
    links.push({
      source: source,
      target: target,
      weight: weight,
    });
  }

  return links;
};

const Index = () => {
  // 🛑 ИСХОДНЫЕ ДАННЫЕ ПАПОК (без позиций и счетчиков)
  const [nodes, setNodes] = useState<Node[]>([]);
  // 🛑 ИСХОДНЫЕ ДАННЫЕ КОНСПЕКТОВ
  const [notes, setNotes] = useState<Note[]>([]);
  
  // Состояние позиций (для сохранения расстановки)
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({});

  // ... (Остальные состояния)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [openedFolderId, setOpenedFolderId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const graphViewRef = useRef<GraphViewRef>(null);
  const [isLoading, setIsLoading] = useState(true); 

  // ----------------------------------------------------------------------
  // 2. useMemo ДЛЯ ПЕРЕСЧЕТА СВЯЗЕЙ (links)
  // ----------------------------------------------------------------------
  const links = useMemo(() => calculateLinks(notes), [notes]);

  // ----------------------------------------------------------------------
  // 3. useMemo ДЛЯ КОМБИНИРОВАНИЯ nodes, notesCount и nodePositions
  // ----------------------------------------------------------------------
  const nodesWithStatsAndPositions = useMemo(() => {
    // 1. Расчет счетчиков конспектов для каждой папки
    const noteCounts = notes.reduce((acc, note) => {
      (note.folderIds || []).forEach(folderId => { 
        acc[folderId] = (acc[folderId] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    // 2. Комбинирование сырых узлов, позиций и счетчиков
    return nodes.map((node) => {
      const position = nodePositions[node.id];
      const noteCount = noteCounts[node.id] || 0;
      
      const nodeWithStats = { ...node, notes: noteCount };
      
      // Применяем позицию, если она сохранена, иначе используем позицию по умолчанию
      return position ? { ...nodeWithStats, ...position } : nodeWithStats;
    });
    
  }, [nodes, notes, nodePositions]); 

  // ----------------------------------------------------------------------
  // 4. ЕДИНЫЙ useEffect ДЛЯ ЗАГРУЗКИ ВСЕХ НАЧАЛЬНЫХ ДАННЫХ
  // ----------------------------------------------------------------------
  useEffect(() => {
    // 🛑 ПРОВЕРКА АВТОРИЗАЦИИ ПРИ ЗАГРУЗКЕ
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Требуется вход в аккаунт");
      // Если используешь react-router-dom, раскомментируй:
      // navigate("/login");
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        // 1. Загружаем папки (уже использует токен и userId из localStorage)
        const backendFolders = await fetchAllFolders();
        const initialNodes = backendFolders.map(f => transformToNode(f, "Folder"));
        setNodes(initialNodes);
        
        // 2. Загружаем заметки для текущего пользователя
        const userId = getCurrentUserId();
        if (!userId) {
          throw new Error("Не найден ID пользователя. Возможно, вы не авторизованы.");
        }

        console.log(`Загружаем заметки для пользователя: ${userId}`);
        const backendNotes = await fetchAllNotes(userId);
        
        // 🛑 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: НОРМАЛИЗАЦИЯ ДАННЫХ
        const normalizedNotes = backendNotes.map(note => ({
          ...note,
          folderIds: note.folderIds || [], // Если null/undefined, используем []
        }));

        setNotes(normalizedNotes); // Используем нормализованный массив

      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        toast.error("Не удалось загрузить данные. Проверьте авторизацию.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const openedFolder = useMemo(
    () => nodes.find((node) => node.id === openedFolderId) ?? null,
    [nodes, openedFolderId],
  );

  const openedFolderNotes = useMemo(
    () => (openedFolderId ? notes.filter((note) => 
      (note.folderIds || []).includes(openedFolderId)
    ) : []),
    [notes, openedFolderId],
  );

  const handleNodePositionChange = useCallback((nodeId: string, position: NodePosition) => {
    setNodePositions((prev) => {
      const current = prev[nodeId];
      if (current && current.x === position.x && current.y === position.y) {
        return prev;
      }
      return {
        ...prev,
        [nodeId]: position,
      };
    });
  }, []);
  
  const handleAddFolder = async (name: string, icon: string) => { 
    if (!name.trim()) return;

    try {
      const newFolder = await createFolder(name.trim()); 
      
      const newNode: Node = {
        id: newFolder.id,
        name: newFolder.name,
        notes: 0, 
        icon: icon || "Folder", 
      };
      
      setNodes(prevNodes => [...prevNodes, newNode]);
      toast.success(`Папка "${name}" создана`);
    } catch (error) {
      console.error("Ошибка создания папки:", error);
      toast.error(`Ошибка при создании папки "${name}".`);
    }
  };

  const handleDeleteFolder = async (id: string) => { 
    const folder = nodes.find(n => n.id === id);
    if (!folder) return;

    try {
      await deleteFolder(id);

      // Обновляем nodes
      setNodes(nodes.filter(n => n.id !== id));
      
      // Обновляем notes (удаляем все ссылки на эту папку)
      setNotes(prevNotes => 
        prevNotes.map(note => ({
          ...note,
          folderIds: note.folderIds.filter(folderId => folderId !== id)
        })).filter(note => note.folderIds.length > 0)
      );
      
      toast.success(`Папка "${folder.name}" удалена`);
      
      if (selectedFolder === id) {
        setSelectedFolder(null);
      }
      if (openedFolderId === id) {
        setOpenedFolderId(null);
      }

    } catch (error) {
      console.error("Ошибка удаления папки:", error);
      toast.error(`Ошибка при удалении папки "${folder.name}".`);
    }
  };

  // ----------------------------------------------------------------------
  // 5. ИСПРАВЛЕНИЕ ЛОГИКИ СОЗДАНИЯ КОНСПЕКТА
  // ----------------------------------------------------------------------
  const handleAddNote = async (title: string, folderIds: string[], description?: string, icon?: string) => {
    // 🛑 КРИТИЧЕСКАЯ ПРОВЕРКА
    if (!title.trim() || !folderIds || folderIds.length === 0) {
      toast.error("Конспект должен иметь заголовок и быть привязан хотя бы к одной папке.");
      console.error("Попытка создать конспект с пустыми обязательными полями.");
      return;
    }
    
    // 🛑 ПОЛУЧЕНИЕ USER ID
    const userId = getCurrentUserId();
    if (!userId) {
      toast.error("Не авторизован. Перезайдите в аккаунт.");
      return;
    }

    // DTO для отправки
    const dto = {
      title: title,
      content: "", 
      folderIds: folderIds, // Гарантированно не пустой массив
      isPublic: false,
      tagIds: [],          // Оставляем пустой массив, если это допустимо бэкендом
      userId: userId,      // ← ДИНАМИЧЕСКИЙ USER ID
    };

    // 🛑 ОТЛАДКА
    console.log("Отправка DTO для создания конспекта:", JSON.stringify(dto, null, 2));

    try {
      const newNoteFromBackend = await createNoteAPI(dto); 
      
      setNotes((prevNotes) => [
        ...prevNotes, 
        {
          id: newNoteFromBackend.id, 
          title: newNoteFromBackend.title,
          folderIds: newNoteFromBackend.folderIds ?? [],
          description: description,
          content: newNoteFromBackend.content,
          lastAccessed: Date.now(),
        } as Note 
      ]);
      
      toast.success(`Конспект "${title}" создан в выбранных папках.`);

    } catch (error) {
      // Улучшенная обработка ошибки
      const errorMsg = error instanceof Error ? error.message : "Неизвестная ошибка";
      console.error("Ошибка при создании конспекта:", errorMsg);
      
      const userFriendlyError = errorMsg.split('\n')[0];
      toast.error(`Ошибка при создании конспекта: ${userFriendlyError}`);
    }
  };

  const handleDeleteNote = async (id: string) => { 
    const note = notes.find(n => n.id === id);
    if (!note) return;

    try {
      await deleteNoteAPI(id);

      setNotes(notes.filter(n => n.id !== id));
      toast.success(`Конспект "${note?.title}" удален`);
      
      if (editingNoteId === id) {
        setEditingNoteId(null);
      }

    } catch (error) {
      console.error("Ошибка удаления конспекта:", error);
      toast.error(`Ошибка при удалении конспекта "${note?.title}".`);
    }
  };

  const handleSaveNote = async (
    noteId: string, 
    content: string, 
    newFolderIds: string[]
  ) => {
    const noteToUpdate = notes.find(n => n.id === noteId);
    if (!noteToUpdate) return;
    
    // 🛑 ПОЛУЧЕНИЕ USER ID
    const userId = getCurrentUserId();
    if (!userId) {
      toast.error("Не авторизован.");
      return;
    }
    
    const dto = {
      title: noteToUpdate.title,
      content: content,
      folderIds: newFolderIds, 
      isPublic: false, 
      tagIds: [],      
      userId: userId, // ← ДИНАМИЧЕСКИЙ USER ID
    };
    
    // 🛑 ОТЛАДКА
    console.log("Отправка DTO для обновления конспекта:", JSON.stringify(dto, null, 2));
    
    try {
      await updateNoteAPI(noteId, dto); 
      
      // Обновляем notes. Это запустит пересчет links.
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === noteId ? { ...note, content, folderIds: newFolderIds, lastAccessed: Date.now() } : note
        )
      );
      
      toast.success(`Конспект "${noteToUpdate.title}" успешно сохранен!`); 

    } catch (error) {
      console.error("Ошибка при сохранении конспекта:", error);
      toast.error(`Ошибка при сохранении конспекта. Проверьте токен и консоль.`);
    }
  };

  const editingNote = useMemo(
    () => notes.find(note => note.id === editingNoteId) ?? null,
    [notes, editingNoteId]
  );

  const handleNodeClick = (node: Node) => {
    setOpenedFolderId(node.id);
  };

  const handleNoteOpen = (noteId: string) => {
    setEditingNoteId(noteId);
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === noteId ? { ...note, lastAccessed: Date.now() } : note
      )
    );
  };

  const recentNotes = useMemo(() => {
    return [...notes]
      .filter(note => note.lastAccessed)
      .sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0))
      .slice(0, 10);
  }, [notes]);

  if (editingNoteId && editingNote) {
    return (
      <NoteEditor
        note={editingNote}
        folders={nodesWithStatsAndPositions} // Используем обновленный массив узлов
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
        onClose={() => setEditingNoteId(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <p>Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SettingsSidebar 
        onAddFolder={handleAddFolder}
        folders={nodesWithStatsAndPositions} // Используем обновленный массив узлов
        notes={recentNotes}
        onDeleteFolder={handleDeleteFolder} 
        onDeleteNote={handleDeleteNote}
        onNoteClick={handleNoteOpen}
      />
      <GraphView 
        ref={graphViewRef}
        data={{ 
          nodes: nodesWithStatsAndPositions, // 🛑 ИСПОЛЬЗУЕМ ОБНОВЛЕННЫЕ УЗЛЫ
          links: links // 🛑 ИСПОЛЬЗУЕМ ПЕРЕСЧИТАННЫЕ СВЯЗИ
        }}
        onNodeClick={handleNodeClick}
        linkMode={false}
        onCreateLink={() => {}}
        onNodePositionChange={handleNodePositionChange}
      />
      <Dialog open={openedFolderId !== null} onOpenChange={(open) => !open && setOpenedFolderId(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              {openedFolder ? `Конспекты папки "${openedFolder.name}"` : "Конспекты"}
            </DialogTitle>
            <DialogDescription>
              Конспект может принадлежать нескольким папкам одновременно.
            </DialogDescription>
          </DialogHeader>
          {openedFolderNotes.length > 0 ? (
            <ScrollArea className="max-h-[70vh] pr-2">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {openedFolderNotes.map((note) => {
                  const noteFolders = note.folderIds
                    .map((folderId) => nodesWithStatsAndPositions.find((node) => node.id === folderId))
                    .filter(Boolean);
                  const descriptionText = note.description?.trim() ?? "Описание не добавлено.";
                  const truncatedDescription =
                    descriptionText.length > NOTE_DESCRIPTION_LIMIT
                      ? `${descriptionText.slice(0, NOTE_DESCRIPTION_LIMIT)}…`
                      : descriptionText;

                  return (
                    <div
                      key={note.id}
                      onClick={() => handleNoteOpen(note.id)}
                      className="rounded-[30px] border border-border bg-card/80 p-6 shadow-md hover:shadow-xl transition-all min-h-[220px] flex flex-col gap-4 cursor-pointer"
                    >
                      <p className="font-semibold text-foreground text-xl leading-tight break-words">
                        {note.title}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Создан {new Date(Number(note.id)).toLocaleDateString("ru-RU")}
                      </p>
                      <p className="text-sm text-muted-foreground flex-1 leading-relaxed whitespace-pre-line break-words">
                        {truncatedDescription}
                      </p>
                      {noteFolders.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {noteFolders.map((folder) => (
                            <Badge key={folder?.id} variant="outline" className="text-xs font-normal">
                              {folder?.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground">
              В этой папке пока нет конспектов. Создайте новый через сайдбар.
            </p>
          )}
        </DialogContent>
      </Dialog>
      <TouchBar 
        folders={nodesWithStatsAndPositions} 
        onAddNote={handleAddNote}
        onAddFolder={handleAddFolder} 
        onZoomIn={() => graphViewRef.current?.zoomIn()}
        onZoomOut={() => graphViewRef.current?.zoomOut()}
        onResetView={() => graphViewRef.current?.resetView()}
      />
    </div>
  );
};

export default Index;