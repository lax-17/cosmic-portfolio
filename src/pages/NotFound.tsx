import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Cosmic background effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="text-center z-10 px-4">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 animate-pulse">
            404
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        <h2 className="text-3xl font-semibold text-white mb-4">
          Lost in the Digital Cosmos
        </h2>

        <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
          The page you're looking for has drifted into the void. Let's get you back to the mainframe.
        </p>

        <div className="space-y-4">
          <a
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Return to Home Base
          </a>

          <div className="text-sm text-gray-400">
            <p>Or navigate to:</p>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <a href="/#experience" className="text-blue-400 hover:text-blue-300 transition-colors">Experience</a>
              <a href="/#projects" className="text-blue-400 hover:text-blue-300 transition-colors">Projects</a>
              <a href="/#skills" className="text-blue-400 hover:text-blue-300 transition-colors">Skills</a>
              <a href="/#contact" className="text-blue-400 hover:text-blue-300 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
