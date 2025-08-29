import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useMemo } from "react";
import { GitCommit, GitBranch, Calendar, MapPin, Search, Filter, Download, Eye, EyeOff, ChevronDown, ChevronUp, Settings } from "lucide-react";

const GitCommitTimeline = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [expandedCommits, setExpandedCommits] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'company'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const commits = [
    {
      hash: "a7f9e42",
      date: "June 2025",
      author: "laxmikant-nishad",
      branch: "main",
      title: "feat: AI Researcher position at Sheffield Hallam University",
      message: "Leading research in advanced AI systems and multi-modal models\n\n+ Developing novel approaches to improve model performance\n+ Research publication pipeline established\n+ Cross-disciplinary collaboration with medical teams",
      tags: ["research", "ai-systems", "publications"],
      company: "Sheffield Hallam University",
      location: "Sheffield, UK",
      type: "feature",
      status: "current"
    },
    {
      hash: "c3b8d91",
      date: "Oct 2023 - Dec 2023", 
      author: "laxmikant-nishad",
      branch: "development",
      title: "feat: Junior Developer Intern at Tan Theta Software Studio",
      message: "Contributed to AI-powered software solutions\n\n+ Production-level ML systems development\n+ Agile development practices\n+ Code review and testing protocols\n+ Team collaboration and mentorship",
      tags: ["development", "ml-systems", "production"],
      company: "Tan Theta Software Studio",
      location: "Remote",
      type: "feature"
    },
    {
      hash: "e9d2c18",
      date: "Jan 2022 - June 2022",
      author: "laxmikant-nishad", 
      branch: "collaboration",
      title: "feat: Industry Collaboration Coordinator at Ufa University",
      message: "Coordinated industry partnerships and research collaborations\n\n+ Partnership management with tech companies\n+ Research project coordination\n+ Academic-industry bridge building\n+ International collaboration facilitation",
      tags: ["coordination", "partnerships", "research"],
      company: "Ufa University",
      location: "Ufa, Russia",
      type: "feature"
    },
    {
      hash: "f1a5b7c",
      date: "2021 - 2022",
      author: "laxmikant-nishad",
      branch: "education",
      title: "chore: Advanced AI/ML skill development",
      message: "Intensive learning and project development phase\n\n+ PyTorch mastery achieved\n+ Computer vision specialization\n+ NLP and transformer architectures\n+ Multiple personal projects completed",
      tags: ["learning", "pytorch", "cv", "nlp"],
      company: "Self-directed Learning",
      location: "Various",
      type: "chore"
    }
  ];

  // Filtered and sorted commits
  const filteredAndSortedCommits = useMemo(() => {
    let filtered = commits.filter(commit => {
      const matchesSearch = !searchTerm ||
        commit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commit.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commit.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commit.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesBranch = !selectedBranch || commit.branch === selectedBranch;
      const matchesType = !selectedType || commit.type === selectedType;

      return matchesSearch && matchesBranch && matchesType;
    });

    // Sort commits
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          // Simple date comparison (newer dates first by default)
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'company':
          comparison = a.company.localeCompare(b.company);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [commits, searchTerm, selectedBranch, selectedType, sortBy, sortOrder]);

  const getCommitTypeColor = (type: string) => {
    switch (type) {
      case "feature": return "hsl(var(--neural-green))";
      case "chore": return "hsl(var(--neural-blue))";
      case "fix": return "hsl(var(--neural-pink))";
      default: return "hsl(var(--muted))";
    }
  };

  // Export functionality
  const exportTimeline = (format: 'json' | 'csv') => {
    const exportData = filteredAndSortedCommits.map(commit => ({
      hash: commit.hash,
      date: commit.date,
      title: commit.title,
      company: commit.company,
      location: commit.location,
      branch: commit.branch,
      type: commit.type,
      tags: commit.tags.join(', '),
      message: commit.message.replace(/\n/g, ' ')
    }));

    if (format === 'json') {
      const dataStr = JSON.stringify({
        commits: exportData,
        metadata: {
          totalCommits: exportData.length,
          dateRange: {
            earliest: exportData[exportData.length - 1]?.date,
            latest: exportData[0]?.date
          },
          companies: [...new Set(exportData.map(c => c.company))],
          branches: [...new Set(exportData.map(c => c.branch))],
          exportDate: new Date().toISOString()
        }
      }, null, 2);

      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'career-timeline.json';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const csvHeaders = 'Hash,Date,Title,Company,Location,Branch,Type,Tags,Message\n';
      const csvRows = exportData.map(commit =>
        `"${commit.hash}","${commit.date}","${commit.title}","${commit.company}","${commit.location}","${commit.branch}","${commit.type}","${commit.tags}","${commit.message}"`
      ).join('\n');

      const csv = csvHeaders + csvRows;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'career-timeline.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Toggle commit expansion
  const toggleCommitExpansion = (hash: string) => {
    setExpandedCommits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hash)) {
        newSet.delete(hash);
      } else {
        newSet.add(hash);
      }
      return newSet;
    });
  };

  // Get unique values for filters
  const branches = [...new Set(commits.map(c => c.branch))];
  const types = [...new Set(commits.map(c => c.type))];

  return (
    <section id="experience" className="py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
        >
          <div className="text-data-header mb-6">
            ~/career $ git log --oneline --graph
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-muted/50 rounded-lg cosmic-border">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search commits, companies, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            {/* Branch Filter */}
            <div className="relative">
              <GitBranch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedBranch || ""}
                onChange={(e) => setSelectedBranch(e.target.value || null)}
                className="pl-10 pr-8 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm appearance-none"
              >
                <option value="">All Branches</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedType || ""}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="pl-10 pr-8 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm appearance-none"
              >
                <option value="">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
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
                <option value="date">Sort by Date</option>
                <option value="type">Sort by Type</option>
                <option value="company">Sort by Company</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => exportTimeline('json')}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                title="Export as JSON"
              >
                <Download className="w-4 h-4 mr-1" />
                JSON
              </button>
              <button
                onClick={() => exportTimeline('csv')}
                className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm"
                title="Export as CSV"
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </button>
            </div>
          </div>

          <div className="asymmetric-layout">
            {/* Git Log Output */}
            <div>
              <div className="terminal-panel">
                <div className="terminal-header">
                  <div className="flex gap-2">
                    <div className="terminal-dot bg-red-500"></div>
                    <div className="terminal-dot bg-yellow-500"></div>
                    <div className="terminal-dot bg-green-500"></div>
                  </div>
                  <div className="text-xs">career-timeline.git</div>
                </div>

                <div className="terminal-content">
                  <div className="space-y-4 text-sm md:text-base">
                    {filteredAndSortedCommits.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <GitCommit className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No commits match your current filters.</p>
                        <p className="text-sm">Try adjusting your search or filter criteria.</p>
                      </div>
                    ) : (
                      filteredAndSortedCommits.map((commit, index) => {
                        const isExpanded = expandedCommits.has(commit.hash);

                        return (
                          <motion.div
                            key={commit.hash}
                            initial={{ opacity: 0, x: -30 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.05,
                              ease: "easeOut"
                            }}
                            className="commit-entry group"
                            style={{
                              willChange: "transform, opacity"
                            }}
                          >
                        <div className={`flex items-start gap-4 w-full ${index === 0 ? 'relative' : ''}`}>
                          {/* Commit Graph */}
                          <div className="flex flex-col items-center mt-1">
                            <div
                              className="w-3 h-3 rounded-full border-2"
                              style={{
                                borderColor: getCommitTypeColor(commit.type),
                                backgroundColor: commit.status === 'current' ? getCommitTypeColor(commit.type) : 'transparent'
                              }}
                            ></div>
                            {index < commits.length - 1 && (
                              <div
                                className="w-px h-12 mt-2"
                                style={{ backgroundColor: "hsl(var(--muted))" }}
                              ></div>
                            )}
                          </div>

                          {/* Commit Details */}
                          <div className="flex-1 min-w-0">
                            {/* Commit Header */}
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span
                                className="commit-hash px-2 py-1 text-xs font-mono border"
                                style={{ borderColor: getCommitTypeColor(commit.type) }}
                              >
                                {commit.hash}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {commit.author}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                on {commit.branch}
                              </span>
                              {commit.status === 'current' && (
                                <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                                  HEAD
                                </span>
                              )}
                            </div>

                            {/* Commit Message */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <div className="font-semibold text-foreground">
                                  {commit.title}
                                </div>
                                <button
                                  onClick={() => toggleCommitExpansion(commit.hash)}
                                  className="p-1 hover:bg-muted rounded transition-colors"
                                  title={isExpanded ? "Collapse" : "Expand"}
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                              </div>
                              <AnimatePresence>
                                {isExpanded ? (
                                  <motion.pre
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-sm text-muted-foreground whitespace-pre-wrap font-mono"
                                  >
                                    {commit.message}
                                  </motion.pre>
                                ) : (
                                  <div className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                                    {commit.message.split('\n')[0]}{commit.message.includes('\n') && '...'}
                                  </div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Company & Location */}
                            <div className="flex items-center gap-4 mb-2 text-sm">
                              <div className="flex items-center gap-1">
                                <GitBranch size={14} className="text-accent" />
                                <span>{commit.company}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin size={14} className="text-muted-foreground" />
                                <span className="text-muted-foreground">{commit.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar size={14} className="text-muted-foreground" />
                                <span className="text-muted-foreground">{commit.date}</span>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                              {commit.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="text-xs px-2 py-1 bg-muted/20 text-muted-foreground font-mono"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* System.json panel beside first job */}
                          {index === 0 && (
                            <motion.div
                              initial={{ opacity: 0, x: 30 }}
                              animate={inView ? { opacity: 1, x: 0 } : {}}
                              transition={{ delay: 0.5, duration: 0.3 }}
                              className="absolute right-0 top-0 w-64 hidden lg:block"
                            >
                              <div className="code-panel">
                                <div className="code-header">
                                  <span className="text-xs">system.json</span>
                                </div>
                                <div className="p-4 text-xs space-y-2">
                                  <div className="text-muted-foreground">// Live System Data</div>
                                  <div><span className="syntax-keyword">status</span>: <span className="syntax-string">"active"</span></div>
                                  <div><span className="syntax-keyword">location</span>: <span className="syntax-string">"Leeds, UK"</span></div>
                                  <div><span className="syntax-keyword">experience</span>: <span className="syntax-number">3</span> years</div>
                                  <div><span className="syntax-keyword">projects</span>: <span className="syntax-number">10</span>+</div>
                                  <div><span className="syntax-keyword">accuracy_boost</span>: <span className="syntax-number">40</span>%</div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Git Statistics */}
            <div className="space-y-4 sticky top-4">
              {/* Commit Stats */}
              <div className="code-panel">
                <div className="code-header">
                  <span className="text-xs">git-stats.json</span>
                </div>
                <div className="p-4 text-xs space-y-2">
                  <div className="text-muted-foreground">// Repository Statistics</div>
                  <div><span className="syntax-keyword">total_commits</span>: <span className="syntax-number">{filteredAndSortedCommits.length}</span>{searchTerm && <span className="text-muted-foreground">/{commits.length}</span>}</div>
                  <div><span className="syntax-keyword">active_years</span>: <span className="syntax-number">4</span></div>
                  <div><span className="syntax-keyword">companies</span>: <span className="syntax-number">{[...new Set(filteredAndSortedCommits.map(c => c.company))].length}</span></div>
                  <div><span className="syntax-keyword">branches</span>: <span className="syntax-number">{[...new Set(filteredAndSortedCommits.map(c => c.branch))].length}</span></div>
                  <div><span className="syntax-keyword">commit_types</span>: <span className="syntax-number">{[...new Set(filteredAndSortedCommits.map(c => c.type))].length}</span></div>
                  <div><span className="syntax-keyword">current_branch</span>: <span className="syntax-string">"main"</span></div>
                  <div><span className="syntax-keyword">status</span>: <span className="syntax-string">"actively_developing"</span></div>
                </div>
              </div>

              {/* Branch Legend */}
              <div className="code-panel">
                <div className="code-header">
                  <span className="text-xs">branches.md</span>
                </div>
                <div className="p-4 text-xs space-y-2">
                  <div className="text-muted-foreground">## Branch Legend</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neural-green"></div>
                      <span>main - Current position</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neural-blue"></div>
                      <span>development - Internship</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neural-pink"></div>
                      <span>collaboration - Coordination</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-muted"></div>
                      <span>education - Learning</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Git Commands */}
              <div className="terminal-panel">
                <div className="terminal-header">
                  <span className="text-xs text-terminal-text">commands</span>
                </div>
                <div className="terminal-content text-xs space-y-1">
                  <div className="text-muted-foreground"># Available commands:</div>
                  <div className="text-terminal-text">git diff HEAD~1</div>
                  <div className="text-terminal-text">git show {commits[0].hash}</div>
                  <div className="text-terminal-text">git branch -v</div>
                  <div className="text-terminal-text">git log --stat</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GitCommitTimeline;