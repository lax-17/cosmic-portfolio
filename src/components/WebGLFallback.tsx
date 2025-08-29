import { useEffect, useState } from "react";

const WebGLFallback = ({ message }: { message?: string }) => {
  const [webGLError, setWebGLError] = useState<string | null>(null);

  useEffect(() => {
    // Check for WebGL support
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement("canvas");
        const gl = 
          canvas.getContext("webgl") || 
          canvas.getContext("experimental-webgl") as WebGLRenderingContext;
        
        if (!gl) {
          return "WebGL is not supported by your browser.";
        }
        
        // Check for WebGL2 support
        const gl2 = 
          canvas.getContext("webgl2") || 
          canvas.getContext("experimental-webgl2") as WebGL2RenderingContext;
        
        if (!gl2) {
          return "WebGL 2.0 is not supported by your browser. Some features may be limited.";
        }
        
        return null;
      } catch (e) {
        return "WebGL is not supported by your browser.";
      }
    };

    const error = checkWebGLSupport();
    setWebGLError(error);
  }, []);

  if (!webGLError) {
    return null;
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-lg">
      <div className="text-center p-6 max-w-md">
        <div className="text-4xl mb-4">🌌</div>
        <h3 className="text-xl font-bold text-white mb-2">WebGL Not Available</h3>
        <p className="text-gray-300 mb-4">
          {webGLError}
        </p>
        <p className="text-gray-400 text-sm">
          {message || "Please try updating your browser or enabling WebGL support."}
        </p>
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-white font-medium mb-2">Recommended Browsers:</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Google Chrome (latest version)</li>
            <li>• Mozilla Firefox (latest version)</li>
            <li>• Microsoft Edge (latest version)</li>
            <li>• Safari (latest version)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WebGLFallback;