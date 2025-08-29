import { useEffect, useRef, useState } from "react";
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

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add point light
    const pointLight = new THREE.PointLight(0x00ffcc, 1, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = zoomLevel;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    
    // Adjust for device capabilities
    const { pixelRatio } = adjustForDevice('medium');
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create nodes
    const nodes: THREE.Mesh[] = [];
    const nodeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    
    // Position nodes in 3D space
    const positions: THREE.Vector3[] = [];
    const gridSize = Math.ceil(Math.sqrt(skillNodes.length));
    
    skillNodes.forEach((node, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      // Create 3D position with some variation in Z
      const position = new THREE.Vector3(
        (col - gridSize / 2) * 2,
        (row - gridSize / 2) * 2,
        (Math.random() - 0.5) * 4
      );
      
      positions.push(position);
      
      // Create material with category color
      const material = new THREE.MeshPhongMaterial({
        color: categoryColors[node.category as keyof typeof categoryColors],
        emissive: categoryColors[node.category as keyof typeof categoryColors].clone().multiplyScalar(0.2),
        shininess: 80,
        transparent: true,
        opacity: 0.9
      });
      
      const mesh = new THREE.Mesh(nodeGeometry, material);
      mesh.position.copy(position);
      mesh.userData = { id: node.id, name: node.name, level: node.level, category: node.category };
      
      scene.add(mesh);
      nodes.push(mesh);
    });
    
    nodesRef.current = nodes;

    // Create connections
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffaa,
      transparent: true,
      opacity: 0.3
    });
    
    connections.forEach(connection => {
      const sourceNode = skillNodes.find(n => n.id === connection.source);
      const targetNode = skillNodes.find(n => n.id === connection.target);
      
      if (sourceNode && targetNode) {
        const sourceIndex = skillNodes.findIndex(n => n.id === connection.source);
        const targetIndex = skillNodes.findIndex(n => n.id === connection.target);
        
        if (sourceIndex !== -1 && targetIndex !== -1) {
          const points = [
            positions[sourceIndex],
            positions[targetIndex]
          ];
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geometry, connectionMaterial);
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
      
      // Raycasting for hover detection
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      
      const intersects = raycaster.intersectObjects(nodesRef.current);
      
      if (intersects.length > 0) {
        const node = intersects[0].object as THREE.Mesh;
        setHoveredNode(node.userData.id);
        
        // Highlight hovered node
        nodesRef.current.forEach(n => {
          const material = n.material as THREE.MeshPhongMaterial;
          if (n.userData.id === node.userData.id) {
            material.emissive.set(0xffffff);
            material.emissiveIntensity = 1.0;
          } else {
            material.emissive.set(categoryColors[n.userData.category as keyof typeof categoryColors]);
            material.emissiveIntensity = 0.2;
          }
        });
      } else {
        setHoveredNode(null);
        
        // Reset node highlights
        nodesRef.current.forEach(n => {
          const material = n.material as THREE.MeshPhongMaterial;
          material.emissive.set(categoryColors[n.userData.category as keyof typeof categoryColors]);
          material.emissiveIntensity = 0.2;
        });
      }
    };

    // Mouse wheel for zoom
    const handleWheel = (event: WheelEvent) => {
      if (!cameraRef.current) return;
      
      cameraRef.current.position.z += event.deltaY * 0.01;
      const newZoomLevel = Math.max(5, Math.min(30, cameraRef.current.position.z));
      cameraRef.current.position.z = newZoomLevel;
      setZoomLevel(newZoomLevel);
    };

    addEventListener(mountRef.current, 'mousemove', handleMouseMove);
    addEventListener(mountRef.current, 'wheel', handleWheel);

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    addEventListener(window, 'resize', handleResize);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      // Rotate scene slowly
      sceneRef.current.rotation.y += rotationSpeed;
      
      // Animate nodes based on skill level
      nodesRef.current.forEach((node, index) => {
        const nodeData = skillNodes[index];
        node.scale.x = 0.5 + (nodeData.level / 100) * 0.5;
        node.scale.y = 0.5 + (nodeData.level / 100) * 0.5;
        node.scale.z = 0.5 + (nodeData.level / 100) * 0.5;
        
        // Pulsing effect for hovered node
        if (hoveredNode === node.userData.id) {
          node.scale.x *= 1 + Math.sin(Date.now() * 0.005) * 0.1;
          node.scale.y *= 1 + Math.sin(Date.now() * 0.005) * 0.1;
          node.scale.z *= 1 + Math.sin(Date.now() * 0.005) * 0.1;
        }
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
  }, [inView, addEventListener, cleanup, hoveredNode, skillNodes, connections, categoryColors, rotationSpeed, zoomLevel]);

  return (
    <div className="relative w-full h-full">
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
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white min-w-[200px]">
          {(() => {
            const node = skillNodes.find(n => n.id === hoveredNode);
            return node ? (
              <div className="space-y-2">
                <h3 className="font-bold text-lg">{node.name}</h3>
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
                  <span className="text-sm capitalize">
                    {node.category === 'ml' ? 'ML/AI' :
                     node.category === 'cv' ? 'Computer Vision' :
                     node.category === 'nlp' ? 'NLP' :
                     'Tools'}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-cosmic h-2 rounded-full"
                    style={{ width: `${node.level}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-300">{node.level}% proficiency</div>
                <div className="text-xs text-gray-400">{node.connections.length} connections</div>
              </div>
            ) : null;
          })()}
        </div>
      )}
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white text-xs">
        <div>Mouse: Rotate | Scroll: Zoom</div>
      </div>
      
      {/* Controls */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
        <div className="space-y-3">
          <div>
            <label className="text-xs block mb-1">Rotation Speed</label>
            <input
              type="range"
              min="0"
              max="0.01"
              step="0.001"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs block mb-1">Zoom Level</label>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDSkillsVisualization;