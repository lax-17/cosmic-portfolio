import { useEffect, useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { usePerformanceOptimization, useWebGLPerformance } from "@/hooks/usePerformanceOptimization";
import WebGLFallback from "./WebGLFallback";

// Import shader files
import vertexShader from "@/shaders/cosmicBackground.vert?raw";
import fragmentShader from "@/shaders/cosmicBackground.frag?raw";

const CosmicShaderBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const { addEventListener, cleanup } = usePerformanceOptimization();
  const { adjustForDevice, cleanupWebGL } = useWebGLPerformance();
  const [webGLEnabled, setWebGLEnabled] = useState(true);

  // Create shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
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

    if (!mountRef.current || !checkWebGLSupport()) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize camera (orthographic for 2D effect)
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 1000);
    camera.position.z = 1;
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
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create fullscreen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    materialRef.current = shaderMaterial;
    const quad = new THREE.Mesh(geometry, shaderMaterial);
    scene.add(quad);

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      const newAspect = window.innerWidth / window.innerHeight;
      cameraRef.current.left = -newAspect;
      cameraRef.current.right = newAspect;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      
      // Update resolution uniform
      if (materialRef.current?.uniforms.resolution) {
        materialRef.current.uniforms.resolution.value.set(
          window.innerWidth,
          window.innerHeight
        );
      }
    };

    addEventListener(window, 'resize', handleResize);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !materialRef.current) return;
      
      // Update time uniform
      const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
      if (materialRef.current.uniforms.time) {
        materialRef.current.uniforms.time.value = elapsedTime;
      }
      
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
  }, [shaderMaterial, addEventListener, cleanup]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    >
      {!webGLEnabled && (
        <WebGLFallback message="Cosmic shader background requires WebGL support." />
      )}
    </div>
  );
};

export default CosmicShaderBackground;