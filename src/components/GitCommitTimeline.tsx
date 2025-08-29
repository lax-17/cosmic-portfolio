import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { GitCommit, GitBranch, Calendar, MapPin } from "lucide-react";

const GitCommitTimeline = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

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

  const getCommitTypeColor = (type: string) => {
    switch (type) {
      case "feature": return "hsl(var(--neural-green))";
      case "chore": return "hsl(var(--neural-blue))";
      case "fix": return "hsl(var(--neural-pink))";
      default: return "hsl(var(--muted))";
    }
  };

  return (
    <section id="experience" className="py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
        >
          <div className="text-data-header mb-8">
            ~/career $ git log --oneline --graph
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
                    {commits.map((commit, index) => (
                      <motion.div
                        key={commit.hash}
                        initial={{ opacity: 0, x: -30 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="commit-entry group"
                      >
                        <div className="flex items-start gap-4 w-full">
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
                              <div className="font-semibold text-foreground mb-1">
                                {commit.title}
                              </div>
                              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                                {commit.message}
                              </pre>
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
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Git Statistics */}
            <div className="space-y-4">
              {/* Commit Stats */}
              <div className="code-panel">
                <div className="code-header">
                  <span className="text-xs">git-stats.json</span>
                </div>
                <div className="p-4 text-xs space-y-2">
                  <div className="text-muted-foreground">// Repository Statistics</div>
                  <div><span className="syntax-keyword">total_commits</span>: <span className="syntax-number">{commits.length}</span></div>
                  <div><span className="syntax-keyword">active_years</span>: <span className="syntax-number">4</span></div>
                  <div><span className="syntax-keyword">branches</span>: <span className="syntax-number">4</span></div>
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