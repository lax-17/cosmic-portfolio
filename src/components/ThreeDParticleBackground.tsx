import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePerformanceOptimization, useWebGLPerformance } from "@/hooks/usePerformanceOptimization";
import WebGLFallback from "./WebGLFallback";

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  originalPosition: THREE.Vector3;
}

const ThreeDParticleBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const { addEventListener, cleanup } = usePerformanceOptimization();
  const { initWebGLContext, adjustForDevice, cleanupWebGL } = useWebGLPerformance();
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

    if (!mountRef.current || !checkWebGLSupport()) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
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
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create particles
    const particleCount = 1000;
    const particles: Particle[] = [];
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // Color (cosmic theme)
      colors[i3] = Math.random() * 0.5 + 0.5; // R (0.5-1.0)
      colors[i3 + 1] = Math.random() * 0.3; // G (0-0.3)
      colors[i3 + 2] = Math.random() * 0.8 + 0.2; // B (0.2-1.0)
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Store particles with their properties
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const position = new THREE.Vector3(
        positions[i3],
        positions[i3 + 1],
        positions[i3 + 2]
      );
      
      particles.push({
        mesh: new THREE.Mesh(), // Dummy mesh for reference
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        originalPosition: position.clone()
      });
    }
    particlesRef.current = particles;

    // Add connections between nearby particles
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.1
    });

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < Math.min(i + 5, particleCount); j++) {
        const distance = particles[i].originalPosition.distanceTo(
          particles[j].originalPosition
        );
        
        if (distance < 2) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            particles[i].originalPosition,
            particles[j].originalPosition
          ]);
          
          const line = new THREE.Line(geometry, connectionMaterial);
          scene.add(line);
        }
      }
    }

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    addEventListener(window, 'mousemove', handleMouseMove);

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    addEventListener(window, 'resize', handleResize);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      // Update particles
      const positions = particleGeometry.getAttribute('position');
      const positionArray = positions.array as Float32Array;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        const particle = particlesRef.current[i];
        const i3 = i * 3;
        
        // Update position with velocity
        positionArray[i3] += particle.velocity.x;
        positionArray[i3 + 1] += particle.velocity.y;
        positionArray[i3 + 2] += particle.velocity.z;
        
        // Mouse interaction
        const mouseEffect = 0.05;
        positionArray[i3] += mouseRef.current.x * mouseEffect;
        positionArray[i3 + 1] += mouseRef.current.y * mouseEffect;
        
        // Boundary check and reset
        if (
          Math.abs(positionArray[i3]) > 10 ||
          Math.abs(positionArray[i3 + 1]) > 10 ||
          Math.abs(positionArray[i3 + 2]) > 10
        ) {
          positionArray[i3] = particle.originalPosition.x;
          positionArray[i3 + 1] = particle.originalPosition.y;
          positionArray[i3 + 2] = particle.originalPosition.z;
        }
      }
      
      positions.needsUpdate = true;
      
      // Rotate scene slowly
      scene.rotation.x += 0.0005;
      scene.rotation.y += 0.001;
      
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
  }, [addEventListener, cleanup]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    >
      {!webGLEnabled && (
        <WebGLFallback message="3D particle background requires WebGL support." />
      )}
    </div>
  );
};

export default ThreeDParticleBackground;