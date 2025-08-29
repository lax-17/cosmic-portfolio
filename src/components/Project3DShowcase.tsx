import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePerformanceOptimization, useWebGLPerformance } from "@/hooks/usePerformanceOptimization";
import { useInView } from "react-intersection-observer";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import WebGLFallback from "./WebGLFallback";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
}

const Project3DShowcase = ({ project }: { project: Project }) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationRef = useRef<number>(0);
  const { cleanup } = usePerformanceOptimization();
  const { adjustForDevice, cleanupWebGL } = useWebGLPerformance();
  const [isLoading, setIsLoading] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  const [webGLEnabled, setWebGLEnabled] = useState(true);

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
    camera.position.z = 5;
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

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Create project-specific 3D model based on category
    let model: THREE.Object3D;
    
    switch (project.category) {
      case "NLP/Healthcare":
        // Create a medical-themed model (DNA helix)
        model = createDNAModel();
        break;
      case "Computer Vision":
        // Create a computer vision-themed model (camera lens)
        model = createCameraModel();
        break;
      case "Medical AI":
        // Create a medical AI-themed model (brain)
        model = createBrainModel();
        break;
      default:
        // Create a generic cube model
        model = createCubeModel();
    }
    
    scene.add(model);

    // Add subtle background particles
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
      particlePositions[i] = (Math.random() - 0.5) * 20;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ffaa,
      size: 0.05,
      transparent: true,
      opacity: 0.5
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !controlsRef.current) return;
      
      // Rotate model slowly
      if (model) {
        model.rotation.y += rotationSpeed;
        model.rotation.x += rotationSpeed * 0.4;
      }
      
      // Update controls
      controlsRef.current.update();
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    // Set loading to false after a short delay to simulate asset loading
    setTimeout(() => {
      setIsLoading(false);
      animate();
    }, 1000);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      cleanup();
      cleanupWebGL();
      
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [inView, cleanup, project.category, rotationSpeed]);

  // Helper functions to create different 3D models
  const createDNAModel = () => {
    const group = new THREE.Group();
    
    // Create DNA helix
    const helixGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const helixMaterial = new THREE.MeshPhongMaterial({ color: 0xff0080 });
    
    for (let i = 0; i < 20; i++) {
      const sphere1 = new THREE.Mesh(helixGeometry, helixMaterial);
      const sphere2 = new THREE.Mesh(helixGeometry, helixMaterial);
      
      const angle = i * 0.5;
      const radius = 1;
      const height = i * 0.3;
      
      sphere1.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      sphere2.position.set(Math.cos(angle + Math.PI) * radius, height, Math.sin(angle + Math.PI) * radius);
      
      group.add(sphere1);
      group.add(sphere2);
      
      // Connect spheres with a line
      const points = [sphere1.position, sphere2.position];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffaa });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      
      group.add(line);
    }
    
    return group;
  };

  const createCameraModel = () => {
    const group = new THREE.Group();
    
    // Create camera body
    const bodyGeometry = new THREE.BoxGeometry(2, 1.5, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x333333,
      shininess: 80
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);
    
    // Create lens
    const lensGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    const lensMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x00aaff,
      transparent: true,
      opacity: 0.7,
      shininess: 100
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.position.z = 0.6;
    lens.rotation.x = Math.PI / 2;
    group.add(lens);
    
    // Create viewfinder
    const viewfinderGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.1);
    const viewfinderMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const viewfinder = new THREE.Mesh(viewfinderGeometry, viewfinderMaterial);
    viewfinder.position.y = 0.4;
    viewfinder.position.z = 0.55;
    group.add(viewfinder);
    
    return group;
  };

  const createBrainModel = () => {
    const group = new THREE.Group();
    
    // Create brain hemispheres
    const hemisphereGeometry = new THREE.SphereGeometry(1, 16, 16, 0, Math.PI * 1.5);
    const hemisphereMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff66cc,
      shininess: 30
    });
    
    const leftHemisphere = new THREE.Mesh(hemisphereGeometry, hemisphereMaterial);
    leftHemisphere.position.x = -0.3;
    leftHemisphere.rotation.z = Math.PI / 8;
    
    const rightHemisphere = new THREE.Mesh(hemisphereGeometry, hemisphereMaterial);
    rightHemisphere.position.x = 0.3;
    rightHemisphere.rotation.z = -Math.PI / 8;
    
    group.add(leftHemisphere);
    group.add(rightHemisphere);
    
    // Add some surface details
    const detailGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const detailMaterial = new THREE.MeshPhongMaterial({ color: 0xff00aa });
    
    for (let i = 0; i < 20; i++) {
      const detail = new THREE.Mesh(detailGeometry, detailMaterial);
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 1.5;
      const radius = 0.8 + Math.random() * 0.2;
      
      detail.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
      
      group.add(detail);
    }
    
    return group;
  };

  const createCubeModel = () => {
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x00ffaa,
      shininess: 80,
      transparent: true,
      opacity: 0.8
    });
    
    // Create a wireframe version for a tech look
    const wireframe = new THREE.WireframeGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const wireframeMesh = new THREE.LineSegments(wireframe, wireframeMaterial);
    
    const cube = new THREE.Mesh(geometry, material);
    cube.add(wireframeMesh);
    
    return cube;
  };

  return (
    <div ref={ref} className="relative w-full h-64 rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center bg-black/20">
          <div className="text-white">Loading 3D model...</div>
        </div>
      ) : !webGLEnabled ? (
        <WebGLFallback message="3D project showcase requires WebGL support." />
      ) : (
        <div
          ref={mountRef}
          className="w-full h-full"
        />
      )}
      
      {/* Project info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <h3 className="text-white font-bold">{project.title}</h3>
        <p className="text-gray-300 text-sm">{project.description}</p>
      </div>
      
      {/* Controls hint */}
      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white text-xs">
        <div>Drag to rotate</div>
      </div>
      
      {/* Controls */}
      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg p-2 text-white">
        <div>
          <label className="text-xs block mb-1">Rotation Speed</label>
          <input
            type="range"
            min="0"
            max="0.02"
            step="0.001"
            value={rotationSpeed}
            onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Project3DShowcase;