import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Save, History, Settings, Zap, Database, Code, Eye, EyeOff } from 'lucide-react';

interface SQLQueryBuilderProps {
  onExecute: (query: string) => void;
  onSave?: (query: string, name: string) => void;
  savedQueries?: Array<{ id: string; name: string; query: string; timestamp: string }>;
  isExecuting?: boolean;
}

const SQLQueryBuilder: React.FC<SQLQueryBuilderProps> = ({
  onExecute,
  onSave,
  savedQueries = [],
  isExecuting = false
}) => {
  const [query, setQuery] = useState('');
  const [showSavedQueries, setShowSavedQueries] = useState(false);
  const [queryName, setQueryName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // SQL Keywords for syntax highlighting
  const sqlKeywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER',
    'ON', 'GROUP', 'BY', 'HAVING', 'ORDER', 'LIMIT', 'OFFSET', 'DISTINCT', 'AS',
    'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TABLE', 'INDEX',
    'UNION', 'ALL', 'EXISTS', 'IN', 'BETWEEN', 'LIKE', 'AND', 'OR', 'NOT', 'NULL',
    'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
  ];

  const sqlFunctions = [
    'CONCAT', 'SUBSTRING', 'UPPER', 'LOWER', 'TRIM', 'LENGTH', 'ROUND', 'DATE',
    'NOW', 'COALESCE', 'CAST', 'EXTRACT', 'DATE_FORMAT', 'JSON_EXTRACT'
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [query]);

  // Syntax highlighting function
  const highlightSyntax = (text: string) => {
    let highlighted = text;

    // Highlight keywords
    sqlKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="syntax-keyword">$&</span>`);
    });

    // Highlight functions
    sqlFunctions.forEach(func => {
      const regex = new RegExp(`\\b${func}\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="syntax-function">$&</span>`);
    });

    // Highlight strings
    highlighted = highlighted.replace(/'([^']*)'/g, `<span class="syntax-string">'$1'</span>`);
    highlighted = highlighted.replace(/"([^"]*)"/g, `<span class="syntax-string">"$1"</span>`);

    // Highlight numbers
    highlighted = highlighted.replace(/\b\d+(\.\d+)?\b/g, `<span class="syntax-number">$&</span>`);

    // Highlight comments
    highlighted = highlighted.replace(/--.*$/gm, `<span class="syntax-comment">$&</span>`);
    highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, `<span class="syntax-comment">$&</span>`);

    return highlighted;
  };

  const handleExecute = () => {
    if (query.trim()) {
      onExecute(query.trim());
    }
  };

  const handleSave = () => {
    if (query.trim() && queryName.trim() && onSave) {
      onSave(query.trim(), queryName.trim());
      setQueryName('');
    }
  };

  const insertTemplate = (template: string) => {
    setQuery(template);
    textareaRef.current?.focus();
  };

  const queryTemplates = [
    {
      name: 'Basic SELECT',
      query: `SELECT name, email, status
FROM contact_info
WHERE status = 'available'
ORDER BY name;`
    },
    {
      name: 'JOIN Query',
      query: `SELECT p.title, p.category, GROUP_CONCAT(s.name) as skills
FROM projects p
LEFT JOIN project_skills ps ON p.id = ps.project_id
LEFT JOIN skills s ON ps.skill_id = s.id
WHERE p.featured = 1
GROUP BY p.id, p.title, p.category
ORDER BY p.created_at DESC;`
    },
    {
      name: 'Analytics Query',
      query: `SELECT
  DATE(timestamp) as date,
  event_type,
  COUNT(*) as event_count
FROM analytics
WHERE timestamp >= DATE('now', '-30 days')
GROUP BY DATE(timestamp), event_type
ORDER BY date DESC, event_count DESC;`
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sql-query-builder"
    >
      {/* Query Builder Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">SQL Query Builder</h3>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            title={showPreview ? "Hide Preview" : "Show Preview"}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSavedQueries(!showSavedQueries)}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            title="Saved Queries"
          >
            <History className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Query Templates */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground mr-2">Templates:</span>
          {queryTemplates.map((template, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => insertTemplate(template.query)}
              className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
            >
              {template.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Query Input */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query here..."
          className="w-full min-h-[120px] p-4 bg-terminal text-terminal-text border border-terminal-border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          spellCheck={false}
        />

        {/* Syntax Highlighted Preview */}
        {showPreview && query && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 p-4 bg-terminal/95 text-terminal-text border border-terminal-border rounded-lg font-mono text-sm pointer-events-none"
            dangerouslySetInnerHTML={{ __html: highlightSyntax(query) }}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExecute}
            disabled={!query.trim() || isExecuting}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Execute Query
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={!query.trim() || !queryName.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Query
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
            placeholder="Query name"
            className="px-3 py-2 bg-muted text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
      </div>

      {/* Saved Queries Panel */}
      <AnimatePresence>
        {showSavedQueries && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 border border-border rounded-lg overflow-hidden"
          >
            <div className="p-4 bg-muted/50">
              <h4 className="text-sm font-semibold text-foreground mb-3">Saved Queries</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {savedQueries.length > 0 ? (
                  savedQueries.map((savedQuery) => (
                    <motion.div
                      key={savedQuery.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 bg-background rounded-md border border-border cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => {
                        setQuery(savedQuery.query);
                        setQueryName(savedQuery.name);
                        setShowSavedQueries(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{savedQuery.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(savedQuery.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 font-mono truncate">
                        {savedQuery.query.substring(0, 60)}...
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No saved queries yet
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SQLQueryBuilder;