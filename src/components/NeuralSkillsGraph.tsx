import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState, useMemo } from "react";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Box, Network, Search, Filter, Download, Settings, Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import CosmicLoader from "./CosmicLoader";

// Lazy load 3D component
const ThreeDSkillsVisualization = lazy(() => import("./ThreeDSkillsVisualization"));

interface SkillNode {
  id: string;
  name: string;
  level: number;
  x: number;
  y: number;
  category: string;
  connections: string[];
}

interface Connection {
  source: string;
  target: string;
  strength: number;
}

const NeuralSkillsGraph = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { addEventListener, throttle } = usePerformanceOptimization();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showStats, setShowStats] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const skillNodes: SkillNode[] = [
    // ML/AI Core
    { id: "pytorch", name: "PyTorch", level: 90, x: 180, y: 130, category: "ml", connections: ["transformers", "computer-vision", "huggingface", "peft"] },
    { id: "transformers", name: "Transformers", level: 88, x: 320, y: 80, category: "ml", connections: ["llama", "huggingface", "nlp", "vit", "ema", "tta"] },
    { id: "huggingface", name: "Hugging Face", level: 85, x: 460, y: 130, category: "ml", connections: ["qlora", "pytorch", "transformers", "accelerate"] },
    { id: "peft", name: "PEFT", level: 85, x: 360, y: 150, category: "ml", connections: ["pytorch", "transformers", "qlora"] },
    { id: "accelerate", name: "Accelerate", level: 80, x: 420, y: 90, category: "ml", connections: ["huggingface", "pytorch"] },
    { id: "bitsandbytes", name: "bitsandbytes", level: 82, x: 410, y: 190, category: "ml", connections: ["pytorch", "qlora"] },

    // Computer Vision
    { id: "computer-vision", name: "Computer Vision", level: 92, x: 130, y: 260, category: "cv", connections: ["opencv", "dinov2", "pytorch", "vit", "mediapipe", "openface"] },
    { id: "opencv", name: "OpenCV", level: 89, x: 80, y: 380, category: "cv", connections: ["computer-vision", "python"] },
    { id: "dinov2", name: "DINOv2", level: 75, x: 220, y: 340, category: "cv", connections: ["computer-vision", "transformers"] },
    { id: "vit", name: "ViT", level: 80, x: 210, y: 280, category: "cv", connections: ["computer-vision", "transformers"] },
    { id: "mediapipe", name: "MediaPipe", level: 78, x: 90, y: 320, category: "cv", connections: ["computer-vision"] },
    { id: "openface", name: "OpenFace", level: 75, x: 160, y: 380, category: "cv", connections: ["computer-vision"] },
    { id: "ema", name: "EMA", level: 70, x: 300, y: 220, category: "ml", connections: ["transformers", "dinov2"] },
    { id: "tta", name: "TTA", level: 70, x: 260, y: 200, category: "ml", connections: ["transformers", "computer-vision"] },

    // NLP
    { id: "nlp", name: "NLP", level: 87, x: 500, y: 210, category: "nlp", connections: ["llama", "rag", "transformers", "structured-json", "eval-pipelines", "safety"] },
    { id: "llama", name: "Llama 3", level: 87, x: 580, y: 160, category: "nlp", connections: ["qlora", "nlp", "transformers", "llama-cpp"] },
    { id: "rag", name: "RAG", level: 85, x: 540, y: 290, category: "nlp", connections: ["nlp", "llama"] },
    { id: "qlora", name: "QLoRA", level: 82, x: 620, y: 240, category: "nlp", connections: ["llama", "huggingface", "bitsandbytes", "peft"] },
    { id: "structured-json", name: "Structured JSON", level: 88, x: 560, y: 240, category: "nlp", connections: ["llama", "rag"] },
    { id: "eval-pipelines", name: "Evaluation Pipelines", level: 84, x: 520, y: 330, category: "ml", connections: ["nlp", "transformers"] },
    { id: "safety", name: "Safety & Hallucination Checks", level: 82, x: 600, y: 320, category: "ml", connections: ["nlp", "llama"] },

    // Tools
    { id: "python", name: "Python", level: 95, x: 260, y: 420, category: "tools", connections: ["pytorch", "opencv", "docker"] },
    { id: "docker", name: "Docker", level: 88, x: 400, y: 380, category: "tools", connections: ["python", "linux", "llama-cpp"] },
    { id: "linux", name: "Linux", level: 91, x: 500, y: 420, category: "tools", connections: ["docker", "cuda"] },
    { id: "cuda", name: "CUDA", level: 82, x: 360, y: 300, category: "tools", connections: ["pytorch", "linux"] },
    { id: "llama-cpp", name: "llama.cpp", level: 78, x: 460, y: 350, category: "tools", connections: ["docker", "llama"] },
  ];

  // Original layout: use static node positions without offsets/scale
  const positionedNodes = useMemo(() => {
    return skillNodes;
  }, []);

  const connections: Connection[] = [];
  skillNodes.forEach(node => {
    node.connections.forEach(targetId => {
      const target = skillNodes.find(n => n.id === targetId);
      if (target) {
        connections.push({
          source: node.id,
          target: targetId,
          strength: (node.level + target.level) / 200
        });
      }
    });
  });

  // Filtered data based on search and category
  const filteredNodes = useMemo(() => {
    return positionedNodes.filter(node => {
      const matchesSearch = !searchTerm ||
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !selectedCategory || node.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [positionedNodes, searchTerm, selectedCategory]);

  const filteredConnections = useMemo(() => {
    const ids = new Set(filteredNodes.map(n => n.id));
    return connections.filter(c => ids.has(c.source) && ids.has(c.target));
  }, [connections, filteredNodes]);

  // Export functionality
  const exportData = (format: 'json' | 'csv') => {
    const exportNodes = filteredNodes.map(node => ({
      name: node.name,
      category: node.category,
      level: node.level,
      connections: node.connections.length
    }));

    if (format === 'json') {
      const dataStr = JSON.stringify({
        nodes: exportNodes,
        connections: filteredConnections,
        metadata: {
          totalNodes: filteredNodes.length,
          totalConnections: filteredConnections.length,
          categories: [...new Set(filteredNodes.map(n => n.category))],
          exportDate: new Date().toISOString()
        }
      }, null, 2);

      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'neural-skills-graph.json';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const csvHeaders = 'Name,Category,Level,Connections\n';
      const csvRows = exportNodes.map(node =>
        `"${node.name}","${node.category}",${node.level},${node.connections}`
      ).join('\n');

      const csv = csvHeaders + csvRows;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'neural-skills-graph.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Zoom and pan handlers
  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const categoryColors = {
    ml: "hsl(var(--neural-green))",
    cv: "hsl(var(--neural-blue))",
    nlp: "hsl(var(--neural-pink))",
    tools: "hsl(var(--muted))"
  };

  useEffect(() => {
    const updateDimensions = throttle(() => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width || 800, height: rect.height || 600 });
      }
    }, 100); // Throttle to 100ms

    updateDimensions();
    addEventListener(window, 'resize', updateDimensions);
  }, [throttle, addEventListener]);

  return (
    <section id="skills" className="py-12 sm:py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
        >
          <div className="text-data-header mb-4 sm:mb-6 cosmic-text">
            ~/skills $ python neural_graph.py --visualize
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-muted/50 rounded-lg cosmic-border">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="pl-10 pr-8 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm appearance-none"
              >
                <option value="">All Categories</option>
                <option value="ml">ML</option>
                <option value="cv">CV</option>
                <option value="nlp">NLP</option>
                <option value="tools">Tools</option>
              </select>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => exportData('json')}
                className="text-xs"
              >
                <Download className="w-4 h-4 mr-1" />
                JSON
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => exportData('csv')}
                className="text-xs"
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Network Visualization */}
            <div className="lg:col-span-2">
              <div className="code-panel h-[400px] sm:h-[500px] md:h-[540px] cosmic-border">
                <div className="code-header flex justify-between items-center">
                  <div>
                    <span className="text-xs cosmic-text">
                      {viewMode === "2d" ? "neural_network.svg" : "neural_network_3d"}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {filteredNodes.length} nodes, {filteredConnections.length} connections
                      {searchTerm && ` (filtered from ${skillNodes.length})`}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {/* Zoom Controls */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleZoom(0.1)}
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleZoom(-0.1)}
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetView}
                      title="Reset View"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1"></div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("2d")}
                      className={viewMode === "2d" ? "bg-primary/20" : ""}
                    >
                      <Network className="w-4 h-4 mr-1" />
                      2D
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("3d")}
                      className={viewMode === "3d" ? "bg-primary/20" : ""}
                    >
                      <Box className="w-4 h-4 mr-1" />
                      3D
                    </Button>
                  </div>
                </div>

                <div
                  className="relative h-full p-2 sm:p-3 md:p-4 overflow-hidden cursor-move"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {viewMode === "2d" ? (
                    <svg
                      ref={svgRef}
                      className="w-full h-full min-w-[720px]"
                      viewBox={`-20 -20 ${Math.max(dimensions.width + 40, 720)} ${Math.max(dimensions.height + 40, 440)}`}
                      preserveAspectRatio="xMidYMid meet"
                      style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                        transformOrigin: 'center',
                        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                      }}
                    >
                      {/* Connections */}
                      {filteredConnections.map((connection, index) => {
                        const sourceNode = filteredNodes.find(n => n.id === connection.source);
                        const targetNode = filteredNodes.find(n => n.id === connection.target);

                        if (!sourceNode || !targetNode) return null;

                        const isHighlighted = hoveredNode === connection.source || hoveredNode === connection.target || selectedNode === connection.source || selectedNode === connection.target;

                        return (
                          <motion.line
                            key={`${connection.source}-${connection.target}`}
                            x1={sourceNode.x}
                            y1={sourceNode.y}
                            x2={targetNode.x}
                            y2={targetNode.y}
                            stroke={isHighlighted ? "hsl(var(--data-active))" : "hsl(var(--data-connection))"}
                            strokeWidth={isHighlighted ? 3 : 1}
                            strokeOpacity={isHighlighted ? 0.9 : 0.3}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                            transition={{
                              duration: 0.8,
                              delay: index * 0.02,
                              ease: "easeOut"
                            }}
                            style={{
                              willChange: "opacity, stroke-dasharray"
                            }}
                          />
                        );
                      })}

                      {/* Skill Nodes */}
                      {filteredNodes.map((node, index) => {
                        const isSelected = selectedNode === node.id;
                        const isHighlighted = hoveredNode === node.id || isSelected;

                        return (
                          <motion.g
                            key={node.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={inView ? { scale: 1, opacity: 1 } : {}}
                            transition={{
                              duration: 0.5,
                              delay: index * 0.05,
                              ease: "easeOut"
                            }}
                            style={{
                              willChange: "transform, opacity"
                            }}
                          >
                            {/* Selection Ring */}
                            {isSelected && (
                              <motion.circle
                                cx={node.x}
                                cy={node.y}
                                r={Math.max(10, node.level / 6)}
                                fill="none"
                                stroke="hsl(var(--primary))"
                                strokeWidth="3"
                                strokeOpacity="0.6"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                              />
                            )}

                            {/* Node Circle */}
                            <motion.circle
                              cx={node.x}
                              cy={node.y}
                              r={Math.max(5, node.level / 10)}
                              fill={categoryColors[node.category as keyof typeof categoryColors]}
                              fillOpacity={isHighlighted ? 0.9 : 0.7}
                              stroke={isSelected ? "hsl(var(--primary))" : categoryColors[node.category as keyof typeof categoryColors]}
                              strokeWidth={isSelected ? 3 : 2}
                              className="cursor-pointer transition-all duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedNode(isSelected ? null : node.id)}
                              onMouseEnter={() => setHoveredNode(node.id)}
                              onMouseLeave={() => setHoveredNode(null)}
                              onTouchStart={() => setHoveredNode(node.id)}
                              onTouchEnd={() => setHoveredNode(null)}
                              role="button"
                              tabIndex={0}
                              aria-label={`View details for ${node.name} skill`}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setSelectedNode(isSelected ? null : node.id);
                                }
                              }}
                            />

                            {/* Node Label */}
                            <text
                              x={node.x}
                              y={node.y - 18}
                              textAnchor="middle"
                              fill="hsl(var(--foreground))"
                              fontSize="10"
                              fontFamily="JetBrains Mono"
                              className="pointer-events-none"
                              opacity={isHighlighted || hoveredNode === null ? 1 : 0.6}
                            >
                              {node.name}
                            </text>

                            {/* Skill Level */}
                            <text
                              x={node.x}
                              y={node.y + 20}
                              textAnchor="middle"
                              fill="hsl(var(--muted-foreground))"
                              fontSize="8"
                              fontFamily="JetBrains Mono"
                              className="pointer-events-none"
                              opacity={isHighlighted ? 1 : 0}
                            >
                              {node.level}%
                            </text>
                          </motion.g>
                        );
                      })}
                    </svg>
                  ) : (
                    <div className="w-full h-full">
                      <Suspense fallback={<CosmicLoader message="Loading 3D skills visualization..." />}>
                        <ThreeDSkillsVisualization />
                      </Suspense>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-3">
              {/* Legend */}
              <div className="code-panel cosmic-border">
                <div className="code-header">
                  <span className="text-xs cosmic-text">legend.json</span>
                </div>
                <div className="p-3 space-y-2">
                  {Object.entries(categoryColors).map(([category, color]) => (
                    <motion.div
                      key={category}
                      className="flex items-center gap-2 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    >
                      <div
                        className="w-2 h-2 rounded-full cosmic-glow"
                        style={{
                          backgroundColor: color,
                          opacity: selectedCategory === category ? 1 : 0.6
                        }}
                      ></div>
                      <span className={`text-xs font-mono capitalize transition-opacity ${
                        selectedCategory === category ? 'text-primary' : ''
                      }`}>
                        {category === 'ml' ? 'ML' :
                          category === 'cv' ? 'CV' :
                          category === 'nlp' ? 'NLP' :
                          'Tools'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Network Stats */}
              <div className="terminal-panel cosmic-glow">
                <div className="terminal-header">
                  <span className="text-xs text-terminal-text cosmic-text">network.stats</span>
                </div>
                <div className="terminal-content text-xs space-y-1">
                  <div className="text-muted-foreground">// Analysis</div>
                  <div><span className="syntax-keyword">nodes</span>: <span className="syntax-number">{filteredNodes.length}</span>{searchTerm && <span className="text-muted-foreground">/{skillNodes.length}</span>}</div>
                  <div><span className="syntax-keyword">connections</span>: <span className="syntax-number">{filteredConnections.length}</span>{searchTerm && <span className="text-muted-foreground">/{connections.length}</span>}</div>
                  <div><span className="syntax-keyword">avg_level</span>: <span className="syntax-number">
                    {filteredNodes.length > 0 ? Math.round(filteredNodes.reduce((sum, node) => sum + node.level, 0) / filteredNodes.length) : 0}
                  </span>%</div>
                  <div><span className="syntax-keyword">categories</span>: <span className="syntax-number">{[...new Set(filteredNodes.map(n => n.category))].length}</span></div>
                  <div><span className="syntax-keyword">zoom</span>: <span className="syntax-number">{Math.round(zoom * 100)}</span>%</div>
                </div>
              </div>

              {/* Selected Node Info */}
              <AnimatePresence>
                {selectedNode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="code-panel cosmic-border"
                  >
                    <div className="code-header flex justify-between items-center">
                      <span className="text-xs cosmic-text">node_details.json</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedNode(null)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                    <div className="p-3 text-xs">
                      {(() => {
                        const node = filteredNodes.find(n => n.id === selectedNode);
                        if (!node) return null;

                        const connectedNodes = filteredNodes.filter(n =>
                          node.connections.includes(n.id) ||
                          n.connections.includes(node.id)
                        );

                        return (
                          <div className="space-y-2">
                            <div><span className="syntax-keyword">name</span>: <span className="syntax-string">"{node.name}"</span></div>
                            <div><span className="syntax-keyword">level</span>: <span className="syntax-number">{node.level}</span>%</div>
                            <div><span className="syntax-keyword">category</span>: <span className="syntax-string">"{node.category}"</span></div>
                            <div><span className="syntax-keyword">connections</span>: <span className="syntax-number">{node.connections.length}</span></div>
                            <div className="border-t border-border pt-2 mt-2">
                              <div className="text-muted-foreground mb-1">// Connected to:</div>
                              {connectedNodes.slice(0, 5).map(connectedNode => (
                                <div key={connectedNode.id} className="text-xs">
                                  <span className="syntax-string">"{connectedNode.name}"</span>
                                  <span className="text-muted-foreground"> ({connectedNode.level}%)</span>
                                </div>
                              ))}
                              {connectedNodes.length > 5 && (
                                <div className="text-xs text-muted-foreground">
                                  ... and {connectedNodes.length - 5} more
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Actions */}
              <div className="code-panel cosmic-border">
                <div className="code-header">
                  <span className="text-xs cosmic-text">actions.sh</span>
                </div>
                <div className="p-3 space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStats(!showStats)}
                    className="w-full justify-start text-xs"
                  >
                    {showStats ? <EyeOff className="w-3 h-3 mr-2" /> : <Eye className="w-3 h-3 mr-2" />}
                    {showStats ? 'Hide' : 'Show'} Stats
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetView}
                    className="w-full justify-start text-xs"
                  >
                    <RotateCcw className="w-3 h-3 mr-2" />
                    Reset View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NeuralSkillsGraph;