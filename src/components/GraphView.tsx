import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
// Импортируем все возможные иконки, которые могут быть у папок
import { 
  ZoomIn, ZoomOut, Maximize2, Folder, Code, Book, Atom, Zap, 
  Feather, Package, Heart, Lightbulb, GraduationCap, LucideIcon, FileText
} from "lucide-react"; 
import { Button } from "@/components/ui/button";

// 1. Создаем карту для сопоставления имени иконки и компонента
const iconMap: { [key: string]: LucideIcon } = {
  Folder: Folder,
  Code: Code,
  Book: Book,
  GraduationCap: GraduationCap,
  Lightbulb: Lightbulb,
  Atom: Atom,
  Zap: Zap,
  Feather: Feather,
  Package: Package,
  Heart: Heart,
  // Добавляем иконку по умолчанию на случай, если значок не задан
  Default: FileText, 
};

// Функция для получения компонента иконки по имени
const getIconComponent = (iconName?: string): LucideIcon => {
    if (iconName && iconMap[iconName]) {
        return iconMap[iconName];
    }
    return iconMap.Default;
};

// ----------------------------------------------------------------------

interface Node {
  id: string;
  name: string;
  notes: number;
  x?: number;
  y?: number;
  icon?: string; 
}

interface Link {
  source: string;
  target: string;
  weight?: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface GraphViewProps {
  data: GraphData;
  onNodeClick?: (node: Node) => void;
  linkMode: boolean;
  onCreateLink?: (sourceId: string, targetId: string) => void;
  onNodePositionChange?: (nodeId: string, position: { x: number; y: number }) => void;
}

export interface GraphViewRef {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
}

export const GraphView = forwardRef<GraphViewRef, GraphViewProps>(({ data, onNodeClick, linkMode, onCreateLink, onNodePositionChange }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodes, setNodes] = useState<Node[]>([]);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const shouldIgnoreClickRef = useRef(false);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth - 320,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Установка и позиционирование узлов
  useEffect(() => {
    if (data.nodes.length === 0) {
      setNodes([]);
      return;
    }

    const updatedNodes = data.nodes.map((node, i) => {
      // Если координаты не заданы, располагаем узлы по кругу
      if (node.x === undefined || node.y === undefined) {
        const angle = (i / data.nodes.length) * 2 * Math.PI;
        const radius = Math.min(dimensions.width, dimensions.height) / 4;
        const positionedNode = {
          ...node,
          x: dimensions.width / 2 + Math.cos(angle) * radius,
          y: dimensions.height / 2 + Math.sin(angle) * radius,
        };
        onNodePositionChange?.(node.id, { x: positionedNode.x, y: positionedNode.y });
        return positionedNode;
      }
      return node;
    });
    setNodes(updatedNodes);
  }, [data.nodes, dimensions, onNodePositionChange]);

  const handleNodeClick = (node: Node, e: React.MouseEvent) => {
    e.stopPropagation();
    if (shouldIgnoreClickRef.current) {
      shouldIgnoreClickRef.current = false;
      return;
    }
    if (linkMode) {
      if (selectedNode === null) {
        setSelectedNode(node.id);
      } else if (selectedNode !== node.id) {
        onCreateLink?.(selectedNode, node.id);
        setSelectedNode(null);
      }
    } else {
      onNodeClick?.(node);
    }
  };

  const handleMouseDown = (node: Node, e: React.MouseEvent) => {
    e.preventDefault();
    if (node.x === undefined || node.y === undefined) return;
    
    const svg = svgRef.current;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    dragStartRef.current = { x: e.clientX, y: e.clientY };
    shouldIgnoreClickRef.current = false;
    setDraggedNode(node.id);
    setDragOffset({
      x: svgP.x - node.x,
      y: svgP.y - node.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNode || !svgRef.current) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    const svgX = svgP.x - dragOffset.x;
    const svgY = svgP.y - dragOffset.y;

    setNodes(prevNodes =>
      prevNodes.map(n =>
        n.id === draggedNode 
          ? { ...n, x: svgX, y: svgY }
          : n
      )
    );
    onNodePositionChange?.(draggedNode, { x: svgX, y: svgY });

    if (dragStartRef.current && !shouldIgnoreClickRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > 5) {
        shouldIgnoreClickRef.current = true;
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    dragStartRef.current = null;
    if (shouldIgnoreClickRef.current) {
      requestAnimationFrame(() => {
        shouldIgnoreClickRef.current = false;
      });
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  useImperativeHandle(ref, () => ({
    zoomIn: handleZoomIn,
    zoomOut: handleZoomOut,
    resetView: handleResetView,
  }));

  const getNodeById = (id: string) => nodes.find(n => n.id === id);

  return (
    <div className="flex-1 bg-graph-bg relative overflow-hidden">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="cursor-grab active:cursor-grabbing"
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {/* Градиент для линий (связи) */}
            <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(210, 40%, 60%)" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="hsl(210, 40%, 90%)" stopOpacity="1"/>
                <stop offset="100%" stopColor="hsl(210, 40%, 60%)" stopOpacity="0.8"/>
            </linearGradient>
            {/* Градиент для анимированной точки (не используется в финальной версии, но оставлен) */}
            <radialGradient id="dotGradient">
                <stop offset="0%" stopColor="hsl(40, 90%, 70%)" />
                <stop offset="100%" stopColor="hsl(40, 90%, 50%)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Links */}
          {data.links.map((link, i) => {
            const sourceNode = getNodeById(link.source);
            const targetNode = getNodeById(link.target);
            if (!sourceNode || !targetNode) return null;
            
            // Расчет толщины и прозрачности линии в зависимости от weight (кол-ва общих конспектов)
            const weight = link.weight ?? 1;
            const strokeWidth = Math.min(6, 2 + (weight - 1) * 1.5); 
            const linkOpacity = Math.min(1, 0.5 + (weight - 1) * 0.2); 

            return (
              <g key={`link-${i}`}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="url(#linkGradient)" 
                  strokeWidth={strokeWidth}
                  opacity={linkOpacity}
                  strokeLinecap="round" 
                />
                {/* Анимированная точка - визуализация связи */}
                <circle
                  r="3"
                  fill="hsl(40, 90%, 70%)" 
                  opacity="1"
                  filter="url(#glow)" 
                >
                  <animateMotion
                    dur="5s" 
                    repeatCount="indefinite"
                    path={`M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`}
                    rotate="auto"
                  />
                </circle>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            if (node.x === undefined || node.y === undefined) return null;
            
            const isSelected = linkMode && selectedNode === node.id;
            const isHovered = hoveredNode === node.id;
            const nodeSize = 40;
            
            // Получаем компонент иконки для текущей папки
            const IconComponent = getIconComponent(node.icon); 

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onMouseDown={(e) => handleMouseDown(node, e)}
                onClick={(e) => handleNodeClick(node, e)}
                style={{ cursor: "pointer" }}
              >
                {/* Node glow */}
                {(isSelected || isHovered) && (
                  <circle
                    r={nodeSize + 5}
                    fill={isSelected ? "hsl(0, 0%, 60%)" : "hsl(0, 0%, 50%)"}
                    opacity="0.3"
                    filter="url(#glow)"
                  />
                )}

                {/* Node circle */}
                <circle
                  r={nodeSize}
                  fill="hsl(0, 0%, 8%)"
                  stroke={isSelected ? "hsl(0, 0%, 90%)" : "hsl(0, 0%, 70%)"}
                  strokeWidth={isSelected || isHovered ? "3" : "2"}
                  className="transition-all"
                />

                {/* РЕНДЕРИНГ ИКОНКИ LUCIDE */}
                <foreignObject x={-16} y={-16} width={32} height={32} pointerEvents="none">
                    <div className="flex items-center justify-center h-full">
                        <IconComponent 
                            className="text-white/80" 
                            size={24} 
                            style={{ 
                                strokeWidth: 2, 
                                opacity: 0.8 
                            }} 
                        />
                    </div>
                </foreignObject>


                {/* Node label */}
                <text
                  y={nodeSize + 20}
                  textAnchor="middle"
                  fill="hsl(210, 40%, 98%)"
                  fontSize="14"
                  fontWeight="500"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {node.name}
                </text>

                {/* Notes count badge */}
                {node.notes > 0 && (
                  <g transform={`translate(${nodeSize - 12}, ${-nodeSize + 12})`}>
                    <circle
                      r="12"
                      fill="hsl(0, 84%, 60%)"
                      stroke="hsl(240, 8%, 12%)"
                      strokeWidth="2"
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fill="white"
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="Inter, system-ui, sans-serif"
                    >
                      {node.notes}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Режим создания связи */}
      {linkMode && (
        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 shadow-glow">
          <p className="text-sm text-foreground font-medium">
            {selectedNode 
              ? "Выберите вторую папку для создания связи" 
              : "Выберите первую папку"}
          </p>
        </div>
      )}
    </div>
  );
});
