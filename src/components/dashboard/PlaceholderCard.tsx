import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Правильный импорт для Vite + React Router
import BlockHeader from "./BlockHeader";
import { fetchAllFolders } from "@/services/folderService";
import { fetchAllNotes } from "@/services/noteService";
import { transformToNode } from "@/services/folderService";
import { 
  Folder, Code, Book, Atom, Zap, Feather, Package, Heart, Lightbulb, GraduationCap, FileText 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Карта иконок (та же, что в GraphView)
const iconMap: Record<string, any> = {
  Folder, Code, Book, GraduationCap, Lightbulb, Atom, Zap, Feather, Package, Heart,
  Default: FileText,
};

const getIcon = (iconName?: string) => {
  const Icon = iconMap[iconName || ""] || iconMap.Default;
  return <Icon className="w-4 h-4 text-white/80" strokeWidth={2} />;
};

// Расчёт связей
const calculateLinks = (notes: any[]) => {
  const linkMap = new Map<string, number>();
  notes.forEach(note => {
    const folderIds = (note.folderIds || []).sort();
    if (folderIds.length < 2) return;
    for (let i = 0; i < folderIds.length; i++) {
      for (let j = i + 1; j < folderIds.length; j++) {
        const key = `${folderIds[i]}_${folderIds[j]}`;
        linkMap.set(key, (linkMap.get(key) || 0) + 1);
      }
    }
  });
  const links: { source: string; target: string; weight: number }[] = [];
  for (const [key, weight] of linkMap.entries()) {
    const [source, target] = key.split('_');
    links.push({ source, target, weight });
  }
  return links;
};

// Получение userId из localStorage
const getCurrentUserId = (): string | null => {
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;
  try {
    const user = JSON.parse(userJson);
    return user.id || user.userId || user.uuid || null;
  } catch {
    return null;
  }
};

const PlaceholderCard = () => {
  const navigate = useNavigate();

  const [nodes, setNodes] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openedFolderId, setOpenedFolderId] = useState<string | null>(null); // null = граф, иначе = список конспектов

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const userId = getCurrentUserId();
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const backendFolders = await fetchAllFolders();
        const baseNodes = backendFolders.map(folder => transformToNode(folder, "Folder"));

        const backendNotes = await fetchAllNotes(userId);
        const normalizedNotes = backendNotes.map((note: any) => ({
          ...note,
          folderIds: note.folderIds || [],
        }));

        const calculatedLinks = calculateLinks(normalizedNotes);

        const noteCounts = normalizedNotes.reduce((acc: Record<string, number>, note: any) => {
          note.folderIds.forEach((fid: string) => {
            acc[fid] = (acc[fid] || 0) + 1;
          });
          return acc;
        }, {});

        const nodesWithCounts = baseNodes.map(node => ({
          ...node,
          notes: noteCounts[node.id] || 0,
        }));

        setNodes(nodesWithCounts);
        setNotes(normalizedNotes);
        setLinks(calculatedLinks);
      } catch (err) {
        console.error("Ошибка загрузки данных для превью графа:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Позиционирование — папки сильно отдалены
  const positionedNodes = nodes.map((node: any, i: number, arr: any[]) => {
    if (arr.length === 0) return node;
    const angle = (i / arr.length) * 2 * Math.PI - Math.PI / 2;
    const radius = arr.length <= 3 ? 50 : arr.length <= 6 ? 100 : 150; // большой радиус
    return {
      ...node,
      x: 200 + Math.cos(angle) * radius,
      y: 150 + Math.sin(angle) * radius,
    };
  });

  const getNodeById = (id: string) => positionedNodes.find(n => n.id === id);

  const openedFolder = positionedNodes.find(n => n.id === openedFolderId);
  const openedFolderNotes = openedFolderId
    ? notes.filter(note => note.folderIds.includes(openedFolderId))
    : [];

  const handleNoteClick = (noteId: string) => {
    // Переход на страницу редактирования конспекта
    // Измени путь, если у тебя другой роутинг
    navigate(`/notes/${noteId}`);
  };

  if (isLoading) {
    return (
      <div className="h-full bg-card border border-border rounded-[0.75rem] p-6 flex flex-col animate-fade-in-delay-2">
        <BlockHeader title="Граф" to="/folder" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Загрузка графа...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-card border border-border rounded-[0.75rem] p-6 flex flex-col animate-fade-in-delay-2">
      <BlockHeader title="Граф" to="/folder" />

      <div className="flex-1 relative overflow-hidden bg-graph-bg rounded-lg">
        {/* Режим: список конспектов или граф */}
        {openedFolderId ? (
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card/50">
              <h3 className="font-semibold text-foreground">
                {openedFolder?.name} ({openedFolderNotes.length})
              </h3>
              <button
                onClick={() => setOpenedFolderId(null)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Назад
              </button>
            </div>

            <ScrollArea className="flex-1 px-4">
              {openedFolderNotes.length > 0 ? (
                <div className="grid gap-3 py-4">
                  {openedFolderNotes.map((note: any) => (
                    <div
                      key={note.id}
                      onClick={() => handleNoteClick(note.id)}
                      className="rounded-xl border border-border bg-card/60 p-4 hover:bg-card/90 transition-all cursor-pointer shadow-sm hover:shadow"
                    >
                      <h4 className="font-medium text-foreground mb-1">{note.title}</h4>
                      {note.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {note.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {note.folderIds
                          .map((fid: string) => nodes.find(n => n.id === fid))
                          .filter(Boolean)
                          .map((folder: any) => (
                            <Badge key={folder.id} variant="outline" className="text-xs">
                              {folder.name}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground text-sm py-8">
                  В этой папке пока нет конспектов
                </p>
              )}
            </ScrollArea>
          </div>
        ) : nodes.length > 0 ? (
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <defs>
              <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(210, 40%, 60%)" stopOpacity="0.8" />
                <stop offset="50%" stopColor="hsl(210, 40%, 90%)" stopOpacity="1" />
                <stop offset="100%" stopColor="hsl(210, 40%, 60%)" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Связи */}
            {links.map((link, i) => {
              const source = getNodeById(link.source);
              const target = getNodeById(link.target);
              if (!source || !target) return null;
              const weight = link.weight || 1;
              const strokeWidth = 2 + (weight - 1);

              return (
                <g key={`link-${i}`}>
                  <line
                    x1={source.x} y1={source.y}
                    x2={target.x} y2={target.y}
                    stroke="url(#linkGradient)"
                    strokeWidth={strokeWidth}
                    opacity="0.6"
                    strokeLinecap="round"
                  />
                  <circle r="3" fill="hsl(40, 90%, 70%)" filter="url(#glow)">
                    <animateMotion
                      dur="6s"
                      repeatCount="indefinite"
                      path={`M${source.x},${source.y} L${target.x},${target.y}`}
                      rotate="auto"
                    />
                  </circle>
                </g>
              );
            })}

            {/* Узлы */}
            {positionedNodes.map((node: any) => (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
                onClick={() => setOpenedFolderId(node.id)}
              >
                {/* Основной круг узла — уменьшен */}
                <circle r="24" fill="hsl(0, 0%, 8%)" stroke="hsl(0, 0%, 70%)" strokeWidth="2" />

                {/* Иконка — меньше */}
                <foreignObject x="-10" y="-10" width="20" height="20">
                  <div className="flex items-center justify-center h-full">
                    {getIcon(node.icon)}  {/* иконка уже w-4 h-4 = 16px */}
                  </div>
                </foreignObject>

                {/* Название папки — ближе и мельче */}
                <text y="35" textAnchor="middle" fill="hsl(210, 40%, 98%)" fontSize="11" fontWeight="500">
                  {node.name}
                </text>

                {/* Бейджик с количеством заметок — меньше */}
                {node.notes > 0 && (
                  <g transform="translate(15, -15)">
                    <circle r="8" fill="hsl(0, 84%, 60%)" stroke="hsl(240, 8%, 12%)" strokeWidth="1.5" />
                    <text textAnchor="middle" dy="3" fill="white" fontSize="9" fontWeight="600">
                      {node.notes}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <p className="text-muted-foreground text-sm mb-2">Граф знаний пуст</p>
            <p className="text-xs text-muted-foreground/70">
              Создайте папки и конспекты,<br />чтобы увидеть связи
            </p>
          </div>
        )}

        {/* Подсказка */}
        {!openedFolderId && nodes.length > 0 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <p className="text-xs text-muted-foreground opacity-70">
              Клик по папке — просмотр конспектов
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceholderCard;