import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github, Box, Search, Filter, Download, SortAsc, SortDesc, Eye, Star, Calendar } from "lucide-react";
import { useState, useMemo } from "react";
import Project3DShowcase from "./Project3DShowcase";

const ProjectsSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [viewMode, setViewMode] = useState<"cards" | "3d">("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'title' | 'category' | 'tech'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

    const projects = [
      {
        id: "clinical-narrative",
        title: "Clinical Narrative Assistant",
        tech: ["Llama 3 8B", "QLoRA", "Transformers", "PEFT", "bitsandbytes", "Accelerate", "Python"],
        description: "End‑to‑end healthcare LLM system: QLoRA fine‑tuning (Llama 3 8B, 8192‑token context), schema‑faithful JSON outputs for EHR/RAG, safety & hallucination checks, and Docker + llama.cpp packaging for offline inference. 600 clinician‑validated synthetic profiles used for evaluation and regression tests.",
        highlights: [
          "QLoRA fine‑tuning (Llama 3 8B)",
          "8192‑token context",
          "600 clinician‑validated profiles",
          "Schema‑faithful JSON outputs",
          "Safety & hallucination checks",
          "Docker + llama.cpp (offline)",
          "Evaluation & regression tests"
        ],
        category: "NLP/Healthcare",
        status: "completed",
        featured: true,
        github: "https://github.com/laxmikant-nishad/clinical-narrative",
        demo: "https://clinical-narrative-demo.vercel.app",
        date: "2025",
        duration: "3 months",
        complexity: "Advanced",
        collaborators: 4,
        impact: "High"
      },
      {
        id: "drone-navigation",
        title: "Object-Tracking Drone Navigation",
        tech: ["OpenCV", "Python", "PID Control", "GPS/IMU Fusion"],
        description: "Real‑time drone pursuit with robust object tracking and closed‑loop PID control. v2 integrates GPS/IMU + vision fusion for stable navigation under noisy measurements and occlusions; tuned controllers yield smooth path corrections and latency‑aware command outputs.",
        highlights: [
          "Real‑time tracking (30 FPS)",
          "Closed‑loop PID control",
          "GPS + vision fusion (v2)",
          "Robust to occlusions",
          "Latency‑aware control"
        ],
        category: "Computer Vision",
        status: "completed",
        featured: true,
        github: "https://github.com/laxmikant-nishad/drone-navigation",
        demo: "https://drone-navigation-demo.vercel.app",
        date: "2023",
        duration: "2 months",
        complexity: "Expert",
        collaborators: 1,
        impact: "High"
      },
      {
        id: "fmri-reconstruction",
        title: "fMRI Image Reconstruction",
        tech: ["StyleGAN2", "U‑Net", "PyTorch", "LSGAN", "Deep Learning"],
        description: "GAN‑based brain imaging reconstruction on Algonauts‑style data. Achieved SSIM 0.87 and PSNR 28.4 dB with StyleGAN2 + U‑Net hybrid; stabilized training via LSGAN objective and careful normalization; analyzed domain mismatch and instability factors.",
        highlights: [
          "StyleGAN2 + U‑Net hybrid",
          "SSIM 0.87 / PSNR 28.4 dB",
          "Stable training via LSGAN",
          "Normalization & EMA tuning",
          "Domain mismatch analysis"
        ],
        category: "Medical AI",
        status: "research",
        featured: true,
        github: "https://github.com/laxmikant-nishad/fmri-reconstruction",
        demo: null,
        date: "2024",
        duration: "3 months",
        complexity: "Expert",
        collaborators: 1,
        impact: "Very High"
      }
    ];

    // Filtered and sorted projects
    const filteredAndSortedProjects = useMemo(() => {
      let filtered = projects.filter(project => {
        const matchesSearch = !searchTerm ||
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.tech.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
          project.highlights.some(highlight => highlight.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = !selectedCategory || project.category === selectedCategory;

        return matchesSearch && matchesCategory;
      });

      // Sort projects
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'category':
            comparison = a.category.localeCompare(b.category);
            break;
          case 'tech':
            comparison = a.tech.length - b.tech.length;
            break;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });

      return filtered;
    }, [projects, searchTerm, selectedCategory, sortBy, sortOrder]);

    // Export functionality
    const exportProjects = (format: 'json' | 'csv') => {
      const exportData = filteredAndSortedProjects.map(project => ({
        title: project.title,
        category: project.category,
        description: project.description,
        technologies: project.tech.join(', '),
        highlights: project.highlights.join(', '),
        status: project.status,
        complexity: project.complexity,
        impact: project.impact,
        collaborators: project.collaborators,
        date: project.date,
        github: project.github,
        demo: project.demo
      }));

      if (format === 'json') {
        const dataStr = JSON.stringify({
          projects: exportData,
          metadata: {
            totalProjects: exportData.length,
            categories: [...new Set(exportData.map(p => p.category))],
            technologies: [...new Set(exportData.flatMap(p => p.technologies.split(', ')))],
            exportDate: new Date().toISOString()
          }
        }, null, 2);

        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'featured-projects.json';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const csvHeaders = 'Title,Category,Description,Technologies,Highlights,Status,Complexity,Impact,Collaborators,Date,GitHub,Demo\n';
        const csvRows = exportData.map(project =>
          `"${project.title}","${project.category}","${project.description}","${project.technologies}","${project.highlights}","${project.status}","${project.complexity}","${project.impact}",${project.collaborators},"${project.date}","${project.github}","${project.demo || ''}"`
        ).join('\n');

        const csv = csvHeaders + csvRows;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'featured-projects.csv';
        a.click();
        URL.revokeObjectURL(url);
      }
    };

    // Get unique categories
    const categories = [...new Set(projects.map(p => p.category))];

  return (
    <section id="projects" className="min-h-screen flex items-center py-20 scroll-mt-20">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header with Controls */}
          <div className="mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-section text-cosmic mb-8"
            >
              Featured Projects
            </motion.h2>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 bg-muted/50 rounded-lg cosmic-border">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects, technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="pl-10 pr-8 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm appearance-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                >
                  <option value="title">Sort by Title</option>
                  <option value="category">Sort by Category</option>
                  <option value="tech">Sort by Tech Count</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                  title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>

              {/* Export Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => exportProjects('json')}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  title="Export as JSON"
                >
                  <Download className="w-4 h-4 mr-1" />
                  JSON
                </button>
                <button
                  onClick={() => exportProjects('csv')}
                  className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm"
                  title="Export as CSV"
                >
                  <Download className="w-4 h-4 mr-1" />
                  CSV
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === "cards"
                      ? "bg-primary text-primary-foreground"
                      : "bg-glass text-foreground hover:bg-primary/10"
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode("3d")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    viewMode === "3d"
                      ? "bg-primary text-primary-foreground"
                      : "bg-glass text-foreground hover:bg-primary/10"
                  }`}
                >
                  <Box className="w-4 h-4" />
                  3D Models
                </button>
              </div>
            </div>
          </div>

          {/* Projects Statistics */}
          <div className="mb-8 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{filteredAndSortedProjects.length}</div>
                <div className="text-sm text-muted-foreground">Total Projects</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{[...new Set(filteredAndSortedProjects.map(p => p.category))].length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{[...new Set(filteredAndSortedProjects.flatMap(p => p.tech))].length}</div>
                <div className="text-sm text-muted-foreground">Technologies</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{filteredAndSortedProjects.filter(p => p.featured).length}</div>
                <div className="text-sm text-muted-foreground">Featured</div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedProjects.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-muted-foreground">
                  <Box className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No projects match your current filters</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              </div>
            ) : viewMode === "cards" ? (
              filteredAndSortedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                  whileHover={{
                    y: -8,
                    rotateY: 5,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  className="glass-card group cursor-pointer perspective-1000"
                  onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                >
                  <div className="p-6 h-full flex flex-col">
                    {/* Header with Category and Featured Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        className="inline-block px-3 py-1 text-xs font-semibold text-primary glass-card"
                      >
                        {project.category}
                      </motion.div>
                      {project.featured && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={inView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-500/20 text-yellow-600 rounded-full"
                        >
                          <Star className="w-3 h-3" />
                          Featured
                        </motion.div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-cosmic mb-2 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>

                    {/* Status and Date */}
                    <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                      <span className={`px-2 py-1 rounded-full ${
                        project.status === 'completed' ? 'bg-green-500/20 text-green-600' :
                        project.status === 'research' ? 'bg-blue-500/20 text-blue-600' :
                        'bg-gray-500/20 text-gray-600'
                      }`}>
                        {project.status}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {project.date}
                      </span>
                      {project.duration && (
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {project.duration}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-4 flex-grow text-sm">
                      {project.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.highlights.map((highlight, hIndex) => (
                        <motion.span
                          key={hIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={inView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ duration: 0.5, delay: 1.0 + index * 0.2 + hIndex * 0.1 }}
                          className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                        >
                          {highlight}
                        </motion.span>
                      ))}
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.slice(0, 4).map((tech, tIndex) => (
                        <motion.span
                          key={tIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.5, delay: 1.2 + index * 0.2 + tIndex * 0.1 }}
                          className="px-3 py-1 text-xs font-medium glass-card text-foreground"
                        >
                          {tech}
                        </motion.span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="px-3 py-1 text-xs font-medium glass-card text-muted-foreground">
                          +{project.tech.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Project Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                      <div className="text-center">
                        <div className="font-semibold text-primary">{project.complexity}</div>
                        <div className="text-muted-foreground">Complexity</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-primary">{project.collaborators}</div>
                        <div className="text-muted-foreground">Collaborators</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-primary">{project.impact}</div>
                        <div className="text-muted-foreground">Impact</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 1.4 + index * 0.2 }}
                      className="flex gap-3 mt-auto"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project.id);
                        }}
                        className="flex-1 glass-card px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View Details
                      </motion.button>

                      {project.github && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.github, '_blank');
                          }}
                          className="glass-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 flex items-center justify-center"
                        >
                          <Github size={16} />
                        </motion.button>
                      )}

                      {project.demo && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.demo, '_blank');
                          }}
                          className="glass-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 flex items-center justify-center"
                        >
                          <ExternalLink size={16} />
                        </motion.button>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))
            ) : (
              projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                  className="glass-card group cursor-pointer"
                >
                  <Project3DShowcase project={project} />
                </motion.div>
              ))
            )}
          </div>

          {/* Project Details Modal */}
          <AnimatePresence>
            {selectedProject && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedProject(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-background rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const project = filteredAndSortedProjects.find(p => p.id === selectedProject);
                    if (!project) return null;

                    return (
                      <div className="flex flex-col lg:flex-row">
                        {/* Project Image/Visual */}
                        <div className="lg:w-1/2 bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex items-center justify-center">
                          <div className="text-center">
                            <Box className="w-24 h-24 mx-auto mb-4 text-primary opacity-50" />
                            <h3 className="text-2xl font-bold text-cosmic mb-2">{project.title}</h3>
                            <p className="text-muted-foreground">{project.category}</p>
                          </div>
                        </div>

                        {/* Project Details */}
                        <div className="lg:w-1/2 p-8 overflow-y-auto">
                          <div className="flex justify-between items-start mb-6">
                            <h2 className="text-3xl font-bold text-cosmic">{project.title}</h2>
                            <button
                              onClick={() => setSelectedProject(null)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Status and Meta */}
                          <div className="flex flex-wrap gap-4 mb-6">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              project.status === 'completed' ? 'bg-green-500/20 text-green-600' :
                              project.status === 'research' ? 'bg-blue-500/20 text-blue-600' :
                              'bg-gray-500/20 text-gray-600'
                            }`}>
                              {project.status}
                            </span>
                            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                              {project.category}
                            </span>
                            <span className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {project.date}
                            </span>
                            {project.duration && (
                              <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm">
                                {project.duration}
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold mb-3">Description</h4>
                            <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                          </div>

                          {/* Highlights */}
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold mb-3">Key Highlights</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.highlights.map((highlight, index) => (
                                <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Technologies */}
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold mb-3">Technologies Used</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.tech.map((tech, index) => (
                                <span key={index} className="px-3 py-1 glass-card text-sm">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Project Stats */}
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold mb-3">Project Details</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Complexity:</span>
                                  <span className="font-medium">{project.complexity}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Impact:</span>
                                  <span className="font-medium">{project.impact}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Collaborators:</span>
                                  <span className="font-medium">{project.collaborators}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Featured:</span>
                                  <span className="font-medium">{project.featured ? 'Yes' : 'No'}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            {project.github && (
                              <button
                                onClick={() => window.open(project.github, '_blank')}
                                className="flex-1 bg-muted hover:bg-muted/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                              >
                                <Github className="w-4 h-4" />
                                View on GitHub
                              </button>
                            )}
                            {project.demo && (
                              <button
                                onClick={() => window.open(project.demo, '_blank')}
                                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Live Demo
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;