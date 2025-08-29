import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { Mail, Github, Linkedin, Phone, Copy, ExternalLink, Terminal, Database, Code, Eye, Settings, Zap, Download } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import SQLQueryBuilder from "@/components/SQLQueryBuilder";
import DatabaseVisualizer from "@/components/DatabaseVisualizer";
import DataTable from "@/components/DataTable";
import { ContentService } from "@/content/contentService";

const DataContactPanel = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeQuery, setActiveQuery] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [typingComplete, setTypingComplete] = useState<boolean>(false);
  const [currentTypingIndex, setCurrentTypingIndex] = useState<number>(0);
  const [resultFilter, setResultFilter] = useState<string>("all");

  // New state for enhanced features
  const [viewMode, setViewMode] = useState<'basic' | 'advanced' | 'visualizer'>('basic');
  const [savedQueries, setSavedQueries] = useState<Array<{id: string, name: string, query: string, timestamp: string}>>([]);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [isQueryExecuting, setIsQueryExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<any[]>([]);

  const contactData = {
    name: "Laxmikant Nishad",
    email: "laxmikant.data@gmail.com",
    phone: "+44 7470398416",
    location: "Leeds, UK",
    timezone: "GMT+0",
    status: "available",
    response_time: "24hrs",
    linkedin: "linkedin.com/in/laxmikant-nishad",
    github: "github.com/lax-17",
    languages: ["English", "Hindi"],
    followers_linkedin: "500+",
    followers_github: "200+",
    python_skill: "Advanced",
    pytorch_skill: "Expert",
    ml_experience: "3+ years",
    ai_experience: "2+ years"
  };

  const queries = [
    {
      id: "contact-info",
      query: "SELECT name, email, phone, location FROM contact_info WHERE active = 1;",
      description: "Get basic contact information"
    },
    {
      id: "availability",
      query: "SELECT status, timezone, response_time FROM availability WHERE current_date BETWEEN start_date AND end_date;",
      description: "Check current availability status"
    },
    {
      id: "social-links",
      query: "SELECT platform, url, followers FROM social_profiles WHERE verified = 1 ORDER BY followers DESC;",
      description: "Fetch verified social media profiles"
    },
    {
      id: "skills",
      query: "SELECT skill_name, proficiency_level, years_experience FROM skills WHERE category = 'technical' ORDER BY proficiency_level DESC;",
      description: "Get technical skills overview"
    }
  ];

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const executeQuery = (query: string, id: string, filter: string = "all") => {
    setActiveQuery(id);
    setShowResults(false);
    setTypingComplete(false);
    setCurrentTypingIndex(0);
    setResultFilter(filter);

    // Simulate query execution delay
    setTimeout(() => {
      setActiveQuery("");
      setShowResults(true);
      // Start typing animation after query completes
      setTimeout(() => {
        setTypingComplete(true);
      }, 500);
    }, 2000);
  };

  const getFilteredData = () => {
    const entries = Object.entries(contactData);
    switch (resultFilter) {
      case "location":
        return entries.filter(([key]) =>
          ["location", "timezone", "languages"].includes(key)
        );
      case "status":
        return entries.filter(([key]) =>
          ["status", "response_time"].includes(key)
        );
      case "social":
        return entries.filter(([key]) =>
          ["linkedin", "github", "followers_linkedin", "followers_github"].includes(key)
        );
      case "skills":
        return entries.filter(([key]) =>
          ["python_skill", "pytorch_skill", "ml_experience", "ai_experience"].includes(key)
        );
      case "contact":
        return entries.filter(([key]) =>
          ["name", "email", "phone", "location", "status"].includes(key)
        );
      default:
        return entries;
    }
  };

  // Typing animation effect
  useEffect(() => {
    if (showResults && !typingComplete) {
      const filteredEntries = getFilteredData();
      if (currentTypingIndex < filteredEntries.length) {
        const timer = setTimeout(() => {
          setCurrentTypingIndex(prev => prev + 1);
        }, 200); // Delay between each row appearing
        return () => clearTimeout(timer);
      }
    }
  }, [showResults, typingComplete, currentTypingIndex, resultFilter]);

  // Auto-trigger first query when component comes into view
  useEffect(() => {
    if (inView && !showResults && !activeQuery) {
      setTimeout(() => {
        executeQuery(queries[0].query, queries[0].id, "contact");
      }, 1000);
    }
  }, [inView]);

  return (
    <section id="contact" className="min-h-screen p-8" aria-labelledby="contact-heading">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
        >
          <h2 id="contact-heading" className="sr-only">Contact Information</h2>
          <div className="text-data-header mb-8" aria-hidden="true">
            ~/contact $ mysql -u laxmikant -p portfolio_db
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center gap-2 mb-6 p-4 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground mr-2">View Mode:</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('basic')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                viewMode === 'basic'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-foreground hover:bg-muted'
              }`}
            >
              <Terminal className="w-3 h-3 mr-1" />
              Basic
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('advanced')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                viewMode === 'advanced'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-foreground hover:bg-muted'
              }`}
            >
              <Code className="w-3 h-3 mr-1" />
              Advanced
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('visualizer')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                viewMode === 'visualizer'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-foreground hover:bg-muted'
              }`}
            >
              <Eye className="w-3 h-3 mr-1" />
              Visualizer
            </motion.button>
          </div>

          <div className="asymmetric-layout">
            {/* Database Query Interface */}
            <div>
              {/* Advanced SQL Query Builder */}
              {viewMode === 'advanced' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <SQLQueryBuilder
                    onExecute={(query) => {
                      setIsQueryExecuting(true);
                      setExecutionTime(0);
                      const startTime = Date.now();

                      // Simulate query execution
                      setTimeout(() => {
                        setExecutionTime(Date.now() - startTime);
                        setIsQueryExecuting(false);
                        // Process query results here
                        console.log('Executing query:', query);
                      }, 1500);
                    }}
                    onSave={(query, name) => {
                      const newQuery = {
                        id: `query_${Date.now()}`,
                        name,
                        query,
                        timestamp: new Date().toISOString()
                      };
                      setSavedQueries(prev => [...prev, newQuery]);
                    }}
                    savedQueries={savedQueries}
                    isExecuting={isQueryExecuting}
                  />
                </motion.div>
              )}

              {/* Database Visualizer */}
              {viewMode === 'visualizer' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <DatabaseVisualizer />
                </motion.div>
              )}

              <div className="terminal-panel" role="region" aria-labelledby="database-query-title">
                <header className="terminal-header">
                  <div className="flex gap-2" aria-label="Terminal window controls">
                    <div className="terminal-dot bg-red-500" aria-label="Close terminal"></div>
                    <div className="terminal-dot bg-yellow-500" aria-label="Minimize terminal"></div>
                    <div className="terminal-dot bg-green-500" aria-label="Maximize terminal"></div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Database size={12} aria-hidden="true" />
                    <h3 id="database-query-title" className="sr-only">Database Query Interface</h3>
                    <span aria-hidden="true">portfolio_db</span>
                  </div>
                </header>

                <div className="terminal-content">
                  <div className="text-muted-foreground mb-4 text-sm">
                    MySQL 8.0.33 - Database connection established
                  </div>

                  {/* Query Interface */}
                  <div className="space-y-4">
                    {queries.map((q, index) => (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="text-xs text-muted-foreground mb-1">
                          -- {q.description}
                        </div>
                        <button
                          onClick={() => executeQuery(q.query, q.id, q.id === "contact-info" ? "contact" : q.id === "social-links" ? "social" : q.id === "skills" ? "skills" : q.id === "availability" ? "status" : "all")}
                          className="block w-full text-left p-3 border border-muted/20 hover:border-primary/50 transition-all duration-200 font-mono text-sm hover:bg-primary/5"
                        >
                          <span className="syntax-keyword">mysql{'>'}</span> {q.query}
                        </button>
                        
                        {activeQuery === q.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-2 p-3 bg-muted/10 border border-primary/20"
                          >
                            <div className="text-xs text-primary mb-2">Query executed successfully!</div>
                            <div className="loading-dots text-primary">Processing</div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Enhanced Results Table */}
                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-8"
                    >
                      <motion.div
                        className="text-sm mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="syntax-keyword">Query executed successfully!</span>
                        <br />
                        <span className="text-muted-foreground text-xs">
                          {getFilteredData().length} rows returned from contact_info table
                          {executionTime > 0 && ` in ${executionTime}ms`}
                        </span>
                      </motion.div>

                      {/* Modern DataTable for all modes */}
                      <DataTable
                        data={getFilteredData().map(([key, value]) => ({
                          field: key,
                          value: Array.isArray(value) ? value.join(", ") : value,
                          type: typeof value,
                          actions: key
                        }))}
                        columns={[
                          {
                            key: 'field',
                            label: 'Field',
                            render: (value, row) => (
                              <div className="text-muted-foreground">
                                {(row.field === "location" || row.field === "status") ? (
                                  <button
                                    onClick={() => executeQuery("", "contact-info", row.field)}
                                    className="hover:text-primary transition-colors underline decoration-dotted"
                                    title={`Click to view ${row.field} details`}
                                  >
                                    {value}
                                  </button>
                                ) : (
                                  value
                                )}
                              </div>
                            )
                          },
                          {
                            key: 'value',
                            label: 'Value',
                            render: (value, row) => (
                              <div className="text-foreground font-medium">
                                {value}
                              </div>
                            )
                          },
                          {
                            key: 'type',
                            label: 'Type',
                            render: (value) => (
                              <span className="text-xs bg-muted px-2 py-1 rounded">
                                {value}
                              </span>
                            )
                          },
                          {
                            key: 'actions',
                            label: 'Actions',
                            render: (value, row) => (
                              <div className="flex gap-1">
                                {(row.field === "email" || row.field === "phone") && (
                                  <button
                                    onClick={() => copyToClipboard(row.value, row.field)}
                                    className="p-1 hover:bg-primary/20 transition-colors"
                                    title="Copy to clipboard"
                                  >
                                    {copiedField === row.field ? (
                                      <span className="text-xs text-primary">✓</span>
                                    ) : (
                                      <Copy size={10} className="text-muted-foreground" />
                                    )}
                                  </button>
                                )}
                                {(row.field === "linkedin" || row.field === "github" || row.field === "email") && (
                                  <button
                                    onClick={() => {
                                      const url = row.field === "email"
                                        ? `mailto:${row.value}`
                                        : row.field === "linkedin"
                                        ? `https://${row.value}`
                                        : `https://${row.value}`;
                                      window.open(url, '_blank');
                                    }}
                                    className="p-1 hover:bg-accent/20 transition-colors"
                                    title="Open link"
                                  >
                                    <ExternalLink size={10} className="text-muted-foreground" />
                                  </button>
                                )}
                              </div>
                            )
                          }
                        ]}
                        searchable={false}
                        sortable={false}
                        filterable={false}
                        exportable={true}
                        pagination={false}
                        onCellAction={(action, row, column) => {
                          if (action === 'copy') {
                            copyToClipboard(row.value, row.field);
                          }
                        }}
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Contact Form */}
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            {/* Connection Status & Info Panels */}
            <div className="space-y-4">
              {/* Connection Status */}
              <div className="code-panel">
                <div className="code-header">
                  <span className="text-xs">connection.status</span>
                </div>
                <div className="p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neural-green rounded-full animate-pulse"></div>
                    <span>Database: <span className="text-primary">CONNECTED</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neural-green rounded-full animate-pulse"></div>
                    <span>Status: <span className="text-primary">AVAILABLE</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neural-blue rounded-full"></div>
                    <span>Location: <span className="text-accent">Leeds, UK</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neural-pink rounded-full"></div>
                    <span>Response: {'<'} <span className="text-secondary">{contactData.response_time}</span></span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="terminal-panel">
                <div className="terminal-header">
                  <span className="text-xs text-terminal-text">quick-actions.sh</span>
                </div>
                <div className="terminal-content space-y-2">
                  <div className="text-xs text-muted-foreground"># Quick contact commands</div>
                  
                  <motion.button
                    onClick={() => window.open(`mailto:${contactData.email}`, '_blank')}
                    className="block w-full text-left p-2 border border-primary/30 text-primary hover:bg-primary/10 transition-colors font-mono text-xs"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Mail size={12} className="inline mr-2" />
                    ./send_email.sh
                  </motion.button>

                  <motion.button
                    onClick={() => window.open(`https://${contactData.linkedin}`, '_blank')}
                    className="block w-full text-left p-2 border border-accent/30 text-accent hover:bg-accent/10 transition-colors font-mono text-xs"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Linkedin size={12} className="inline mr-2" />
                    ./connect_linkedin.sh
                  </motion.button>

                  <motion.button
                    onClick={() => window.open(`https://${contactData.github}`, '_blank')}
                    className="block w-full text-left p-2 border border-secondary/30 text-secondary hover:bg-secondary/10 transition-colors font-mono text-xs"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Github size={12} className="inline mr-2" />
                    ./view_github.sh
                  </motion.button>

                  <motion.button
                    onClick={() => window.open('/Laxmikant_Resume.pdf', '_blank')}
                    className="block w-full text-left p-2 border border-terminal-border text-terminal-text hover:bg-terminal/60 transition-colors font-mono text-xs"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title="Download Resume (PDF)"
                  >
                    <Download size={12} className="inline mr-2" />
                    ./download_resume.sh
                  </motion.button>
                </div>
              </div>

              {/* System Info */}
              <div className="code-panel">
                <div className="code-header">
                  <span className="text-xs">system.info</span>
                </div>
                <div className="p-4 text-xs space-y-1 font-mono">
                  <div className="text-muted-foreground">// System Information</div>
                  <div><span className="syntax-keyword">name</span>: <span className="syntax-string">"Laxmikant Nishad"</span></div>
                  <div><span className="syntax-keyword">role</span>: <span className="syntax-string">"Applied AI/ML Engineer"</span></div>
                  <div><span className="syntax-keyword">location</span>: <span className="syntax-string">"Leeds, UK"</span></div>
                  <div><span className="syntax-keyword">experience</span>: <span className="syntax-number">3</span> years</div>
                  <div><span className="syntax-keyword">availability</span>: <span className="syntax-string">"open_to_opportunities"</span></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DataContactPanel;