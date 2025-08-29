
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { usePerformanceOptimization, useWebGLPerformance } from "@/hooks/usePerformanceOptimization";
import { useInView } from "react-intersection-observer";
import WebGLFallback from "./WebGLFallback";

interface SkillNode {
  id: string;
  name: string;
  level: number;
  category: string;
  connections: string[];
}

interface Connection {
  source: string;
  target: string;
  strength: number;
}

const ThreeDSkillsVisualization = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const connectionsRef = useRef<THREE.Line[]>([]);
  const animationRef = useRef<number>(0);
  const { addEventListener, cleanup } = usePerformanceOptimization();
  const { adjustForDevice, cleanupWebGL } = useWebGLPerformance();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.002);
  const [zoomLevel, setZoomLevel] = useState(15);
  const [webGLEnabled, setWebGLEnabled] = useState(true);

  // Skill data (same as in NeuralSkillsGraph)
  const skillNodes: SkillNode[] = [
    // ML/AI Core
    { id: "pytorch", name: "PyTorch", level: 90, category: "ml", connections: ["transformers", "computer-vision", "huggingface"] },
    { id: "transformers", name: "Transformers", level: 88, category: "ml", connections: ["llama", "huggingface", "nlp"] },
    { id: "huggingface", name: "Hugging Face", level: 85, category: "ml", connections: ["qora", "pytorch", "transformers"] },

    // Computer Vision
    { id: "computer-vision", name: "Computer Vision", level: 92, category: "cv", connections: ["opencv", "dinov2", "pytorch"] },
    { id: "opencv", name: "OpenCV", level: 89, category: "cv", connections: ["computer-vision", "python"] },
    { id: "dinov2", name: "DINOv2", level: 75, category: "cv", connections: ["computer-vision", "transformers"] },

    // NLP
    { id: "nlp", name: "NLP", level: 87, category: "nlp", connections: ["llama", "rag", "transformers"] },
    { id: "llama", name: "Llama 3", level: 87, category: "nlp", connections: ["qora", "nlp", "transformers"] },
    { id: "rag", name: "RAG", level: 85, category: "nlp", connections: ["nlp", "llama"] },
    { id: "qora", name: "QLoRA", level: 80, category: "nlp", connections: ["llama", "huggingface"] },

    // Tools
    { id: "python", name: "Python", level: 95, category: "tools", connections: ["pytorch", "opencv", "docker"] },
    { id: "docker", name: "Docker", level: 88, category: "tools", connections: ["python", "linux"] },
    { id: "linux", name: "Linux", level: 91, category: "tools", connections: ["docker", "cuda"] },
    { id: "cuda", name: "CUDA", level: 82, category: "tools", connections: ["pytorch", "linux"] },
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

  // Category colors (matching NeuralSkillsGraph)
  const categoryColors = {
    ml: new THREE.Color(0.2, 1.0, 0.6), // hsl(var(--neural-green))
    cv: new THREE.Color(0.2, 0.6, 1.0), // hsl(var(--neural-blue))
    nlp: new THREE.Color(1.0, 0.2, 0.8), // hsl(var(--neural-pink))
    tools: new THREE.Color(0.6, 0.6, 0.6) // hsl(var(--muted))
  };

  // Create simple space background
  const createSpaceBackground = useCallback((scene: THREE.Scene) => {
    // Set scene background to dark space color
    scene.background = new THREE.Color(0x000011);
    
    // Add some simple stars
    const starGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const starMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6
    });
    
    // Create random star field
    for (let i = 0; i < 100; i++) {
      const star = new THREE.Mesh(starGeometry, starMaterial);
      
      star.position.x = (Math.random() - 0.5) * 100;
      star.position.y = (Math.random() - 0.5) * 100;
      star.position.z = -30 + Math.random() * 20;
      
      scene.add(star);
    }
    
    return { updateTime: () => {} };
  }, []);

  useEffect(() => {
    // Check for WebGL support
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl") as WebGLRenderingContext;
        
        if (!gl) {
          setWebGLEnabled(false);
          return false;
        }
        
        return true;
      } catch (e) {
        setWebGLEnabled(false);
        return false;
      }
    };

    if (!mountRef.current || !inView || !checkWebGLSupport()) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create simple space background
    createSpaceBackground(scene);

    // Simple lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = zoomLevel;
    cameraRef.current = camera;

    // Initialize renderer with enhanced settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setClearColor(0x000011, 0.1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create enhanced nodes with mathematical positioning
    const nodes: THREE.Mesh[] = [];
    const nodeGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    
    // Position nodes using mathematical algorithms
    const positions: THREE.Vector3[] = [];
    
    skillNodes.forEach((node, index) => {
      // Use golden ratio spiral for positioning
      const phi = (1 + Math.sqrt(5)) / 2;
      const angle = index * 2 * Math.PI / phi;
      const radius = Math.sqrt(index) * 1.5;
      
      const position = new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (Math.random() - 0.5) * 6
      );
      
      positions.push(position);
      
      // Enhanced material with cosmic effects
      const material = new THREE.MeshPhongMaterial({
        color: categoryColors[node.category as keyof typeof categoryColors],
        emissive: categoryColors[node.category as keyof typeof categoryColors].clone().multiplyScalar(0.3),
        shininess: 100,
        transparent: true,
        opacity: 0.9
      });
      
      const mesh = new THREE.Mesh(nodeGeometry, material);
      mesh.position.copy(position);
      mesh.userData = { id: node.id, name: node.name, level: node.level, category: node.category };
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      scene.add(mesh);
      nodes.push(mesh);
    });
    
    nodesRef.current = nodes;

    // Enhanced connections with mathematical curves
    connections.forEach(connection => {
      const sourceNode = skillNodes.find(n => n.id === connection.source);
      const targetNode = skillNodes.find(n => n.id === connection.target);
      
      if (sourceNode && targetNode) {
        const sourceIndex = skillNodes.findIndex(n => n.id === connection.source);
        const targetIndex = skillNodes.findIndex(n => n.id === connection.target);
        
        if (sourceIndex !== -1 && targetIndex !== -1) {
          // Create curved connection using quadratic bezier
          const start = positions[sourceIndex];
          const end = positions[targetIndex];
          const mid = start.clone().add(end).multiplyScalar(0.5);
          mid.z += Math.random() * 2 - 1; // Add some curve variation
          
          const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
          const points = curve.getPoints(20);
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({
            color: new THREE.Color().setHSL(0.5 + Math.random() * 0.3, 0.7, 0.6),
            transparent: true,
            opacity: 0.4
          });
          
          const line = new THREE.Line(geometry, material);
          line.userData = { source: connection.source, target: connection.target };
          
          scene.add(line);
          connectionsRef.current.push(line);
        }
      }
    });

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const rect = mountRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      
      const intersects = raycaster.intersectObjects(nodesRef.current);
      
      if (intersects.length > 0) {
        const node = intersects[0].object as THREE.Mesh;
        setHoveredNode(node.userData.id);
        
        // Hover effects
        nodesRef.current.forEach(n => {
          const material = n.material as THREE.MeshPhongMaterial;
          if (n.userData.id === node.userData.id) {
            material.emissive.setHex(0xffffff);
            material.emissiveIntensity = 0.4;
          } else {
            material.emissive.copy(categoryColors[n.userData.category as keyof typeof categoryColors]);
            material.emissiveIntensity = 0.2;
          }
        });
      } else {
        setHoveredNode(null);
        
        nodesRef.current.forEach(n => {
          const material = n.material as THREE.MeshPhongMaterial;
          material.emissive.copy(categoryColors[n.userData.category as keyof typeof categoryColors]);
          material.emissiveIntensity = 0.2;
        });
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (!cameraRef.current) return;
      
      cameraRef.current.position.z += event.deltaY * 0.01;
      const newZoomLevel = Math.max(5, Math.min(50, cameraRef.current.position.z));
      cameraRef.current.position.z = newZoomLevel;
      setZoomLevel(newZoomLevel);
    };

    addEventListener(mountRef.current, 'mousemove', handleMouseMove);
    addEventListener(mountRef.current, 'wheel', handleWheel);

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    addEventListener(window, 'resize', handleResize);

    // Simple animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const time = Date.now() * 0.001;
      
      // Rotate scene slowly
      sceneRef.current.rotation.y += rotationSpeed;
      
      // Animate nodes
      nodesRef.current.forEach((node, index) => {
        const nodeData = skillNodes[index];
        
        // Base scale based on skill level
        const baseScale = 0.8 + (nodeData.level / 100) * 0.4;
        
        // Gentle breathing animation
        const breathe = Math.sin(time + index * 0.3) * 0.1 + 1;
        node.scale.setScalar(baseScale * breathe);
        
        // Enhanced pulsing effect for hovered node
        if (hoveredNode === node.userData.id) {
          const pulse = Math.sin(time * 6) * 0.3 + 1.3;
          node.scale.multiplyScalar(pulse);
        }
      });
      
      // Animate connections
      connectionsRef.current.forEach((line, index) => {
        const material = line.material as THREE.LineBasicMaterial;
        material.opacity = 0.4 + Math.sin(time * 1.5 + index) * 0.2;
      });
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      cleanup();
      cleanupWebGL();
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [inView, addEventListener, cleanup, createSpaceBackground, hoveredNode, rotationSpeed, zoomLevel, adjustForDevice, cleanupWebGL]);

  return (
    <div ref={ref} className="relative w-full h-full">
      {!webGLEnabled ? (
        <WebGLFallback message="3D skills visualization requires WebGL support." />
      ) : (
        <div
          ref={mountRef}
          className="w-full h-full rounded-lg"
        />
      )}
      
      {/* Node info panel */}
      {hoveredNode && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-4 text-white min-w-[200px] border border-cyan-500/30">
          {(() => {
            const node = skillNodes.find(n => n.id === hoveredNode);
            return node ? (
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-cyan-300">{node.name}</h3>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: `hsl(${
                        node.category === 'ml' ? '140, 100%, 60%' :
                        node.category === 'cv' ? '210, 100%, 60%' :
                        node.category === 'nlp' ? '300, 100%, 60%' :
                        '0, 0%, 60%'
                      })`
                    }}
                  ></div>
                  <span className="text-sm font-mono">
                    {node.category === 'ml' ? 'Machine Learning' :
                     node.category === 'cv' ? 'Computer Vision' :
                     node.category === 'nlp' ? 'Natural Language Processing' :
                     'Development Tools'}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${node.level}%` }}
                  ></div>
                </div>
                <div className="text-sm text-cyan-200 font-mono">{node.level}% proficiency</div>
                <div className="text-xs text-gray-400 font-mono">{node.connections.length} connections</div>
              </div>
            ) : null;
          })()}
        </div>
      )}
      
      {/* Simple controls */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md rounded-lg p-3 text-white border border-cyan-500/30">
        <div className="space-y-3">
          <div className="text-sm font-bold text-cyan-300 mb-2">3D Controls</div>
          <div>
            <label className="text-xs block mb-1 text-cyan-300">Rotation Speed</label>
            <input
              type="range"
              min="0"
              max="0.01"
              step="0.001"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>
      </div>
      
      {/* Simple instructions */}
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
        <div className="space-y-1">
          <div className="text-cyan-300 font-bold">Navigation:</div>
          <div>🖱️ Hover nodes for details</div>
          <div>🔄 Scroll to zoom</div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDSkillsVisualization;