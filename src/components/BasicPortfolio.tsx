import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Calendar, ExternalLink, Github, Linkedin, Download, Phone } from "lucide-react";
import BackgroundModeToggle from "./BackgroundModeToggle";

const BasicPortfolio = () => {
  const [activeSection, setActiveSection] = useState("about");

  const sections = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-lg md:text-2xl font-bold text-blue-600 dark:text-blue-400">LN</span>
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">Laxmikant Nishad</h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">AI/ML Engineer</p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <BackgroundModeToggle />
              <button
                onClick={() => setActiveSection(activeSection === "menu" ? "about" : "menu")}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="/Laxmikant_Resume.pdf"
                download="Laxmikant's Resume.pdf"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download size={16} />
                <span>Resume</span>
              </a>
              <BackgroundModeToggle />
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {activeSection === "menu" && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {section.label}
                  </button>
                ))}
                <a
                  href="/Laxmikant_Resume.pdf"
                  download="Laxmikant's Resume.pdf"
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full"
                >
                  <Download size={16} />
                  <span>Download Resume</span>
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16">

        {/* About Section */}
        <section id="about" className="scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">About Me</h2>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  I'm a passionate AI/ML Engineer specializing in applied machine learning and computer vision.
                  I excel at building end-to-end AI systems that solve real-world problems, from healthcare
                  applications to autonomous systems.
                </p>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  With expertise in PyTorch, Transformers, and modern deep learning architectures,
                  I focus on creating production-ready AI solutions with measurable impact.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="text-gray-400" size={20} />
                  <span className="text-gray-700 dark:text-gray-300">Leeds, UK</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="text-gray-400" size={20} />
                  <span className="text-gray-700 dark:text-gray-300">Available for opportunities</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Experience</h2>
            <div className="space-y-4 md:space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Applied AI/LLM Engineer (Clinical Narratives Platform)
                </h3>
                <p className="text-blue-600 dark:text-blue-400 mb-2">Sheffield Hallam University</p>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4">June 2025 - Present</p>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                  Built end-to-end healthcare LLM system (QLoRA, Llama 3 8B, 8192 context) with schema-faithful JSON outputs,
                  safety checks, and Docker/llama.cpp offline inference. Processed 600+ structured patient profiles validated by clinicians.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  AI Researcher — Multi-modal Transformers
                </h3>
                <p className="text-blue-600 dark:text-blue-400 mb-2">Sheffield Hallam University</p>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4">Feb 2025 - Aug 2025</p>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                  Hybrid Conv1D + Transformer fusing DINOv2 embeddings with MediaPipe features; normalization, EMA, threshold calibration,
                  and light TTA. Achieved 0.350 macro-F1; 53.4% accuracy on a 7-class, 2,152-sample dataset.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Junior Developer Intern
                </h3>
                <p className="text-blue-600 dark:text-blue-400 mb-2">Tan Theta Software Studio</p>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4">Oct 2023 - Dec 2023</p>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                  Contributed to AI-powered software solutions. Production-level ML systems development, agile development practices,
                  code review and testing protocols, team collaboration and mentorship.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Projects</h2>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Clinical Narrative Assistant
                </h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4">
                  End-to-end healthcare LLM system with QLoRA fine-tuning (Llama 3 8B, 8192-token context)
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                    Llama 3 8B
                  </span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                    QLoRA
                  </span>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded">
                    PyTorch
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                    Transformers
                  </span>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1">
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:underline flex items-center space-x-1">
                    <Github size={16} />
                    <span>Code</span>
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Object Tracking Drone
                </h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4">
                  Real-time drone pursuit with robust object tracking and closed-loop PID control
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                    OpenCV
                  </span>
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded">
                    Python
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                    PID Control
                  </span>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1">
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:underline flex items-center space-x-1">
                    <Github size={16} />
                    <span>Code</span>
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 md:p-6 md:col-span-2">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  fMRI Image Reconstruction
                </h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4">
                  GAN-based brain imaging reconstruction using StyleGAN2 + U-Net hybrid with LSGAN objective
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                    StyleGAN2
                  </span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                    U-Net
                  </span>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded">
                    PyTorch
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                    LSGAN
                  </span>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1">
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:underline flex items-center space-x-1">
                    <Github size={16} />
                    <span>Code</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Contact</h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 md:p-6">
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-4 md:mb-6">
                I'm always interested in new opportunities and collaborations.
                Feel free to reach out!
              </p>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="text-blue-600 dark:text-blue-400" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">laxmikant.data@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="text-blue-600 dark:text-blue-400" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">+44 7470398416</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-blue-600 dark:text-blue-400" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">Leeds, UK</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <a
                    href="https://linkedin.com/in/laxmikant-nishad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Linkedin size={20} />
                    <span>LinkedIn Profile</span>
                  </a>
                  <a
                    href="https://github.com/lax-17"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    <Github size={20} />
                    <span>GitHub Profile</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2025 Laxmikant Nishad. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BasicPortfolio;