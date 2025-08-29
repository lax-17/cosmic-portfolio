import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { Mail, Github, Linkedin, Phone, Copy, ExternalLink, Terminal, Database } from "lucide-react";
import ContactForm from "@/components/ContactForm";

const DataContactPanel = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeQuery, setActiveQuery] = useState<string>("");

  const contactData = {
    email: "laxmikant.data@gmail.com",
    linkedin: "linkedin.com/in/laxmikant-nishad",
    github: "github.com/lax-17", 
    phone: "+44 7470398416",
    location: "Leeds, UK",
    status: "available",
    timezone: "GMT+0",
    languages: ["English", "Hindi"],
    response_time: "24hrs"
  };

  const queries = [
    {
      id: "contact-info",
      query: "SELECT * FROM contact_info WHERE available = true;",
      description: "Get all contact information"
    },
    {
      id: "availability",
      query: "SELECT status, location, timezone FROM availability;",
      description: "Check current availability"
    },
    {
      id: "social-links",
      query: "SELECT platform, url FROM social_media WHERE active = true;",
      description: "Fetch social media profiles"
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

  const executeQuery = (query: string, id: string) => {
    setActiveQuery(id);
    // Simulate query execution
    setTimeout(() => setActiveQuery(""), 2000);
  };

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

          <div className="asymmetric-layout">
            {/* Database Query Interface */}
            <div>
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
                          onClick={() => executeQuery(q.query, q.id)}
                          className="block w-full text-left p-3 border border-muted/20 hover:border-primary/50 transition-colors font-mono text-sm"
                        >
                          <span className="syntax-keyword">mysql&#62;</span> {q.query}
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

                  {/* Results Table */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                  >
                    <div className="text-sm mb-4">
                      <span className="syntax-keyword">Results:</span> contact_info table
                    </div>
                    
                    <div className="font-mono text-xs">
                      <div className="grid grid-cols-3 gap-4 p-2 bg-muted/20 border-b border-muted">
                        <div className="font-semibold">Field</div>
                        <div className="font-semibold">Value</div>
                        <div className="font-semibold">Actions</div>
                      </div>
                      
                      {Object.entries(contactData).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.7 + index * 0.05 }}
                          className="grid grid-cols-3 gap-4 p-2 border-b border-muted/10 hover:bg-muted/5"
                        >
                          <div className="text-muted-foreground">{key}</div>
                          <div className="text-foreground font-medium">
                            {Array.isArray(value) ? value.join(", ") : value}
                          </div>
                          <div className="flex gap-1">
                            {(key === "email" || key === "phone") && (
                              <button
                                onClick={() => copyToClipboard(value.toString(), key)}
                                className="p-1 hover:bg-primary/20 transition-colors"
                                title="Copy to clipboard"
                              >
                                {copiedField === key ? (
                                  <span className="text-xs text-primary">✓</span>
                                ) : (
                                  <Copy size={10} className="text-muted-foreground" />
                                )}
                              </button>
                            )}
                            {(key === "linkedin" || key === "github" || key === "email") && (
                              <button
                                onClick={() => {
                                  const url = key === "email" 
                                    ? `mailto:${value}`
                                    : key === "linkedin" 
                                    ? `https://${value}`
                                    : `https://${value}`;
                                  window.open(url, '_blank');
                                }}
                                className="p-1 hover:bg-accent/20 transition-colors"
                                title="Open link"
                              >
                                <ExternalLink size={10} className="text-muted-foreground" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
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
                    <span>Response: {"<"} <span className="text-secondary">{contactData.response_time}</span></span>
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
                  <div><span className="syntax-keyword">role</span>: <span className="syntax-string">"AI/ML Engineer"</span></div>
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