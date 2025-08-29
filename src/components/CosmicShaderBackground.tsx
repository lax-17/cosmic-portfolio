import { useEffect, useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { usePerformanceOptimization, useWebGLPerformance } from "@/hooks/usePerformanceOptimization";
import WebGLFallback from "./WebGLFallback";
import { useTheme } from "@/contexts/ThemeContext";

// Import shader files
import vertexShader from "@/shaders/cosmicBackground.vert?raw";
import fragmentShader from "@/shaders/cosmicBackground.frag?raw";

/* --- Utilities to derive colors from CSS variables so the shader matches theme --- */
const HSL_TRIPLET_RE = /(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/;

function parseHSLTriplet(triplet: string) {
  const m = triplet.trim().match(HSL_TRIPLET_RE);
  if (!m) return { h: 230, s: 40, l: 6 }; // sensible dark fallback
  return { h: parseFloat(m[1]), s: parseFloat(m[2]), l: parseFloat(m[3]) };
}

function hslToRgb(h: number, s: number, l: number) {
  const H = ((h % 360) + 360) % 360 / 360;
  const S = Math.max(0, Math.min(1, s / 100));
  const L = Math.max(0, Math.min(1, l / 100));
  if (S === 0) return { r: L, g: L, b: L };
  const q = L < 0.5 ? L * (1 + S) : L + S - L * S;
  const p = 2 * L - q;
  const hue2rgb = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const r = hue2rgb(H + 1 / 3);
  const g = hue2rgb(H);
  const b = hue2rgb(H - 1 / 3);
  return { r, g, b };
}

function cssVarColor(name: string): THREE.Color {
  try {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name);
    const { h, s, l } = parseHSLTriplet(value);
    const { r, g, b } = hslToRgb(h, s, l);
    return new THREE.Color(r, g, b);
  } catch {
    return new THREE.Color(0.04, 0.06, 0.1);
  }
}

function computeThemeUniforms(theme: "light" | "dark") {
  // Enhanced cosmic colors for a more vibrant neural interface
  const base = theme === "dark"
    ? new THREE.Color(0.01, 0.02, 0.08)  // Deep neural blue-black space
    : new THREE.Color(0.98, 0.98, 0.98); // Light background
    
  const accentA = theme === "dark"
    ? new THREE.Color(0.0, 0.8, 1.0)     // Electric cyan - neural energy
    : new THREE.Color(0.1, 0.3, 0.8);    // Blue for light mode
    
  const accentB = theme === "dark"
    ? new THREE.Color(1.0, 0.2, 0.8)     // Vibrant magenta - neural connections
    : new THREE.Color(0.6, 0.2, 0.8);    // Purple for light mode
    
  const starColor = theme === "dark"
    ? new THREE.Color(0.8, 1.0, 1.0)     // Bright cyan-white stars
    : new THREE.Color(0.2, 0.2, 0.2);    // Dark stars for light mode

  // Star-focused values for a cleaner space background
  const intensity = theme === "dark" ? 0.45 : 0.5;
  const alpha = theme === "dark" ? 1.0 : 0.6;
  const exposure = theme === "dark" ? 1.2 : 1.4;

  return { base, accentA, accentB, starColor, intensity, alpha, exposure };
}

const CosmicShaderBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const { addEventListener, cleanup } = usePerformanceOptimization();
  const { adjustForDevice, cleanupWebGL } = useWebGLPerformance();
  const { theme } = useTheme();
  const [webGLEnabled, setWebGLEnabled] = useState(true);

  // Create shader material with enhanced neural cosmic colors
  const shaderMaterial = useMemo(() => {
    // Enhanced neural interface cosmic colors
    const base = new THREE.Color(0.01, 0.02, 0.08);      // Deep neural blue-black space
    const accentA = new THREE.Color(0.0, 0.8, 1.0);      // Electric cyan - neural energy
    const accentB = new THREE.Color(1.0, 0.2, 0.8);      // Vibrant magenta - neural connections
    const starColor = new THREE.Color(0.8, 1.0, 1.0);    // Bright cyan-white stars

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        baseColor: { value: base },
        accentA: { value: accentA },
        accentB: { value: accentB },
        starColor: { value: starColor },
        intensity: { value: 0.45 },   // Star-focused, subtle tint
        alpha: { value: 1.0 },
        exposure: { value: 1.2 }     // Balanced exposure for clean stars
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
  }, []);

  // React to theme changes by pushing CSS-driven colors into the shader
  useEffect(() => {
    if (!materialRef.current) return;
    const { base, accentA, accentB, starColor, intensity, alpha, exposure } = computeThemeUniforms(theme);

    const u: any = materialRef.current.uniforms;
    if (u.baseColor?.value?.isColor) (u.baseColor.value as THREE.Color).copy(base); else u.baseColor.value = base;
    if (u.accentA?.value?.isColor) (u.accentA.value as THREE.Color).copy(accentA); else u.accentA.value = accentA;
    if (u.accentB?.value?.isColor) (u.accentB.value as THREE.Color).copy(accentB); else u.accentB.value = accentB;
    if (u.starColor?.value?.isColor) (u.starColor.value as THREE.Color).copy(starColor); else u.starColor.value = starColor;
    if (u.intensity) u.intensity.value = intensity;
    if (u.alpha) u.alpha.value = alpha;
    if (u.exposure) u.exposure.value = exposure;
  }, [theme]);

  useEffect(() => {
    // Check for WebGL support
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") ||
          (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
        if (!gl) {
          setWebGLEnabled(false);
          return false;
        }
        return true;
      } catch {
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
    const { pixelRatio } = adjustForDevice("medium");
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Ensure canvas blends with the UI and fills the viewport
    const canvas = renderer.domElement as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    // Use normal blend; Additive blending in material handles glow without washing colors
    canvas.style.mixBlendMode = "normal";

    // Seed resolution uniform to drawing buffer size (accounts for devicePixelRatio)
    if (materialRef.current?.uniforms.resolution) {
      materialRef.current.uniforms.resolution.value.set(canvas.width, canvas.height);
    }

    // Create fullscreen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    materialRef.current = shaderMaterial;
    const quad = new THREE.Mesh(geometry, shaderMaterial);
    // Scale quad in X by aspect so it fills horizontally when aspect > 1
    quad.scale.set(aspect, 1, 1);
    meshRef.current = quad;
    scene.add(quad);

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      const newAspect = window.innerWidth / window.innerHeight;
      cameraRef.current.left = -newAspect;
      cameraRef.current.right = newAspect;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);

      // Keep the quad scaled to fill horizontally
      if (meshRef.current) {
        meshRef.current.scale.set(newAspect, 1, 1);
      }

      // Update resolution uniform to actual drawing buffer size
      if (materialRef.current?.uniforms.resolution && rendererRef.current) {
        const canvasEl = rendererRef.current.domElement as HTMLCanvasElement;
        materialRef.current.uniforms.resolution.value.set(
          canvasEl.width,
          canvasEl.height
        );
      }
    };

    addEventListener(window, "resize", handleResize);

    // Push initial theme uniforms after mount as well
    (function seedThemeUniforms() {
      if (!materialRef.current) return;
      const { base, accentA, accentB, starColor, intensity, alpha, exposure } =
        computeThemeUniforms(
          document.documentElement.classList.contains("dark") ? "dark" : "light"
        );
      const u: any = materialRef.current.uniforms;
      (u.baseColor.value as THREE.Color).copy(base);
      (u.accentA.value as THREE.Color).copy(accentA);
      (u.accentB.value as THREE.Color).copy(accentB);
      (u.starColor.value as THREE.Color).copy(starColor);
      u.intensity.value = intensity;
      u.alpha.value = alpha;
      u.exposure.value = exposure;
    })();

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
  }, [shaderMaterial, addEventListener, cleanup, adjustForDevice, cleanupWebGL]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      /* Opacity now controlled by shader 'alpha' uniform so no inline opacity */
    >
      {!webGLEnabled && (
        <WebGLFallback message="Cosmic shader background requires WebGL support." />
      )}
    </div>
  );
};

export default CosmicShaderBackground;