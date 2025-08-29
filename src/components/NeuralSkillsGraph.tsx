import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";

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

  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const skillNodes: SkillNode[] = [
    // ML/AI Core
    { id: "pytorch", name: "PyTorch", level: 90, x: 200, y: 150, category: "ml", connections: ["transformers", "computer-vision", "huggingface"] },
    { id: "transformers", name: "Transformers", level: 88, x: 350, y: 100, category: "ml", connections: ["llama", "huggingface", "nlp"] },
    { id: "huggingface", name: "Hugging Face", level: 85, x: 500, y: 150, category: "ml", connections: ["qora", "pytorch", "transformers"] },
    
    // Computer Vision
    { id: "computer-vision", name: "Computer Vision", level: 92, x: 150, y: 300, category: "cv", connections: ["opencv", "dinov2", "pytorch"] },
    { id: "opencv", name: "OpenCV", level: 89, x: 100, y: 450, category: "cv", connections: ["computer-vision", "python"] },
    { id: "dinov2", name: "DINOv2", level: 75, x: 250, y: 400, category: "cv", connections: ["computer-vision", "transformers"] },
    
    // NLP
    { id: "nlp", name: "NLP", level: 87, x: 550, y: 250, category: "nlp", connections: ["llama", "rag", "transformers"] },
    { id: "llama", name: "Llama 3", level: 87, x: 650, y: 200, category: "nlp", connections: ["qora", "nlp", "transformers"] },
    { id: "rag", name: "RAG", level: 85, x: 600, y: 350, category: "nlp", connections: ["nlp", "llama"] },
    { id: "qora", name: "QLoRA", level: 80, x: 700, y: 300, category: "nlp", connections: ["llama", "huggingface"] },
    
    // Tools
    { id: "python", name: "Python", level: 95, x: 300, y: 500, category: "tools", connections: ["pytorch", "opencv", "docker"] },
    { id: "docker", name: "Docker", level: 88, x: 450, y: 450, category: "tools", connections: ["python", "linux"] },
    { id: "linux", name: "Linux", level: 91, x: 550, y: 500, category: "tools", connections: ["docker", "cuda"] },
    { id: "cuda", name: "CUDA", level: 82, x: 400, y: 350, category: "tools", connections: ["pytorch", "linux"] },
  ];

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

  const categoryColors = {
    ml: "hsl(var(--neural-green))",
    cv: "hsl(var(--neural-blue))",
    nlp: "hsl(var(--neural-pink))",
    tools: "hsl(var(--muted))"
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width || 800, height: rect.height || 600 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <section id="skills" className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
        >
          <div className="text-data-header mb-8">
            ~/skills $ python neural_graph.py --visualize
          </div>

          <div className="asymmetric-layout">
            {/* Network Visualization */}
            <div className="col-span-2">
              <div className="code-panel h-[600px]">
                <div className="code-header">
                  <span className="text-xs">neural_network.svg</span>
                  <span className="text-xs text-muted-foreground">
                    {skillNodes.length} nodes, {connections.length} connections
                  </span>
                </div>
                
                <div className="relative h-full p-4">
                  <svg
                    ref={svgRef}
                    className="w-full h-full"
                    viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                  >
                    {/* Connections */}
                    {connections.map((connection, index) => {
                      const sourceNode = skillNodes.find(n => n.id === connection.source);
                      const targetNode = skillNodes.find(n => n.id === connection.target);
                      
                      if (!sourceNode || !targetNode) return null;

                      const isHighlighted = hoveredNode === connection.source || hoveredNode === connection.target;
                      
                      return (
                        <motion.line
                          key={index}
                          x1={sourceNode.x}
                          y1={sourceNode.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke={isHighlighted ? "hsl(var(--data-active))" : "hsl(var(--data-connection))"}
                          strokeWidth={isHighlighted ? 2 : 1}
                          strokeOpacity={isHighlighted ? 0.8 : 0.3}
                          initial={{ pathLength: 0 }}
                          animate={inView ? { pathLength: 1 } : {}}
                          transition={{ duration: 1, delay: index * 0.05 }}
                        />
                      );
                    })}

                    {/* Skill Nodes */}
                    {skillNodes.map((node, index) => (
                      <motion.g
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        {/* Node Circle */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={Math.max(6, node.level / 8)}
                          fill={categoryColors[node.category as keyof typeof categoryColors]}
                          fillOpacity={hoveredNode === node.id ? 0.8 : 0.6}
                          stroke={categoryColors[node.category as keyof typeof categoryColors]}
                          strokeWidth={2}
                          className="cursor-pointer transition-all duration-200"
                          onMouseEnter={() => setHoveredNode(node.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                        />
                        
                        {/* Node Label */}
                        <text
                          x={node.x}
                          y={node.y - 15}
                          textAnchor="middle"
                          fill="hsl(var(--foreground))"
                          fontSize="10"
                          fontFamily="JetBrains Mono"
                          className="pointer-events-none"
                          opacity={hoveredNode === node.id || hoveredNode === null ? 1 : 0.5}
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
                          opacity={hoveredNode === node.id ? 1 : 0}
                        >
                          {node.level}%
                        </text>
                      </motion.g>
                    ))}

                    {/* Data Flow Animation */}
                    {hoveredNode && connections
                      .filter(c => c.source === hoveredNode || c.target === hoveredNode)
                      .map((connection, index) => {
                        const sourceNode = skillNodes.find(n => n.id === connection.source);
                        const targetNode = skillNodes.find(n => n.id === connection.target);
                        
                        if (!sourceNode || !targetNode) return null;

                        return (
                          <motion.circle
                            key={`flow-${index}`}
                            r="2"
                            fill="hsl(var(--data-active))"
                            initial={{ cx: sourceNode.x, cy: sourceNode.y }}
                            animate={{ 
                              cx: [sourceNode.x, targetNode.x, sourceNode.x],
                              cy: [sourceNode.y, targetNode.y, sourceNode.y]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        );
                      })}
                  </svg>
                </div>
              </div>
            </div>

            {/* Skill Categories Panel */}
            <div className="space-y-4">
              {/* Legend */}
              <div className="code-panel">
                <div className="code-header">
                  <span className="text-xs">legend.json</span>
                </div>
                <div className="p-4 space-y-3">
                  {Object.entries(categoryColors).map(([category, color]) => (
                    <div key={category} className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-xs font-mono capitalize">
                        {category === 'ml' ? 'Machine Learning' : 
                         category === 'cv' ? 'Computer Vision' :
                         category === 'nlp' ? 'Natural Language Processing' :
                         'Development Tools'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Network Stats */}
              <div className="terminal-panel">
                <div className="terminal-header">
                  <span className="text-xs text-terminal-text">network.stats</span>
                </div>
                <div className="terminal-content text-xs space-y-2">
                  <div className="text-muted-foreground">// Network Analysis</div>
                  <div><span className="syntax-keyword">nodes</span>: <span className="syntax-number">{skillNodes.length}</span></div>
                  <div><span className="syntax-keyword">connections</span>: <span className="syntax-number">{connections.length}</span></div>
                  <div><span className="syntax-keyword">avg_skill_level</span>: <span className="syntax-number">
                    {Math.round(skillNodes.reduce((sum, node) => sum + node.level, 0) / skillNodes.length)}
                  </span>%</div>
                  <div><span className="syntax-keyword">specialization</span>: <span className="syntax-string">"AI/ML Engineering"</span></div>
                </div>
              </div>

              {/* Hovered Node Info */}
              {hoveredNode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="code-panel"
                >
                  <div className="code-header">
                    <span className="text-xs">node_info.json</span>
                  </div>
                  <div className="p-4 text-xs">
                    {(() => {
                      const node = skillNodes.find(n => n.id === hoveredNode);
                      return node ? (
                        <div className="space-y-1">
                          <div><span className="syntax-keyword">name</span>: <span className="syntax-string">"{node.name}"</span></div>
                          <div><span className="syntax-keyword">proficiency</span>: <span className="syntax-number">{node.level}</span>%</div>
                          <div><span className="syntax-keyword">category</span>: <span className="syntax-string">"{node.category}"</span></div>
                          <div><span className="syntax-keyword">connections</span>: <span className="syntax-number">{node.connections.length}</span></div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NeuralSkillsGraph;