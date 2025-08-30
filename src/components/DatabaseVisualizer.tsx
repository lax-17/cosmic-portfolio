import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ArrowRight, ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

interface Entity {
  name: string;
  fields: Array<{
    name: string;
    type: string;
    primary?: boolean;
    foreign?: boolean;
    nullable?: boolean;
  }>;
  position: { x: number; y: number };
  color: string;
}

interface Relationship {
  from: string;
  to: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  label?: string;
}

interface DatabaseVisualizerProps {
  entities?: Entity[];
  relationships?: Relationship[];
  onEntityClick?: (entity: Entity) => void;
}

const DatabaseVisualizer: React.FC<DatabaseVisualizerProps> = ({
  entities = [],
  relationships = [],
  onEntityClick
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Default entities based on our schema
  const defaultEntities: Entity[] = [
    {
      name: 'contact_info',
      position: { x: 100, y: 100 },
      color: '#3b82f6',
      fields: [
        { name: 'id', type: 'VARCHAR(36)', primary: true },
        { name: 'name', type: 'VARCHAR(255)' },
        { name: 'email', type: 'VARCHAR(255)' },
        { name: 'phone', type: 'VARCHAR(20)' },
        { name: 'location', type: 'VARCHAR(255)' },
        { name: 'status', type: 'ENUM' },
        { name: 'created_at', type: 'TIMESTAMP' },
        { name: 'updated_at', type: 'TIMESTAMP' }
      ]
    },
    {
      name: 'social_profiles',
      position: { x: 400, y: 100 },
      color: '#10b981',
      fields: [
        { name: 'id', type: 'VARCHAR(36)', primary: true },
        { name: 'contact_id', type: 'VARCHAR(36)', foreign: true },
        { name: 'platform', type: 'ENUM' },
        { name: 'username', type: 'VARCHAR(255)' },
        { name: 'url', type: 'VARCHAR(500)' },
        { name: 'followers', type: 'INT' },
        { name: 'verified', type: 'BOOLEAN' }
      ]
    },
    {
      name: 'projects',
      position: { x: 100, y: 350 },
      color: '#f59e0b',
      fields: [
        { name: 'id', type: 'VARCHAR(36)', primary: true },
        { name: 'title', type: 'VARCHAR(255)' },
        { name: 'description', type: 'TEXT' },
        { name: 'category', type: 'VARCHAR(100)' },
        { name: 'status', type: 'ENUM' },
        { name: 'featured', type: 'BOOLEAN' },
        { name: 'created_at', type: 'TIMESTAMP' }
      ]
    },
    {
      name: 'skills',
      position: { x: 400, y: 350 },
      color: '#ef4444',
      fields: [
        { name: 'id', type: 'VARCHAR(36)', primary: true },
        { name: 'name', type: 'VARCHAR(255)' },
        { name: 'category', type: 'VARCHAR(100)' },
        { name: 'proficiency', type: 'INT' },
        { name: 'description', type: 'TEXT' }
      ]
    },
    {
      name: 'experiences',
      position: { x: 700, y: 100 },
      color: '#8b5cf6',
      fields: [
        { name: 'id', type: 'VARCHAR(36)', primary: true },
        { name: 'title', type: 'VARCHAR(255)' },
        { name: 'company', type: 'VARCHAR(255)' },
        { name: 'start_date', type: 'DATE' },
        { name: 'end_date', type: 'DATE', nullable: true },
        { name: 'current', type: 'BOOLEAN' }
      ]
    }
  ];

  const defaultRelationships: Relationship[] = [
    { from: 'contact_info', to: 'social_profiles', type: 'one-to-many', label: 'has many' },
    { from: 'contact_info', to: 'experiences', type: 'one-to-many', label: 'has many' },
    { from: 'projects', to: 'skills', type: 'many-to-many', label: 'uses' }
  ];

  const currentEntities = entities.length > 0 ? entities : defaultEntities;
  const currentRelationships = relationships.length > 0 ? relationships : defaultRelationships;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const renderEntity = (entity: Entity) => {
    const isSelected = selectedEntity === entity.name;

    return (
      <g key={entity.name}>
        {/* Entity Box */}
        <motion.rect
          x={entity.position.x}
          y={entity.position.y}
          width="200"
          height={40 + entity.fields.length * 20}
          fill={entity.color}
          stroke={isSelected ? '#ffffff' : '#e5e7eb'}
          strokeWidth={isSelected ? '3' : '2'}
          rx="8"
          className="cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            setSelectedEntity(isSelected ? null : entity.name);
            onEntityClick?.(entity);
          }}
        />

        {/* Entity Title */}
        <text
          x={entity.position.x + 100}
          y={entity.position.y + 25}
          textAnchor="middle"
          className="fill-white font-semibold text-sm pointer-events-none"
        >
          {entity.name}
        </text>

        {/* Fields */}
        {entity.fields.map((field, index) => (
          <g key={field.name}>
            <rect
              x={entity.position.x + 5}
              y={entity.position.y + 45 + index * 20}
              width="190"
              height="18"
              fill="rgba(255, 255, 255, 0.1)"
              rx="4"
            />
            <text
              x={entity.position.x + 10}
              y={entity.position.y + 58 + index * 20}
              className="fill-white text-xs"
            >
              {field.primary && '🔑 '}
              {field.foreign && '🔗 '}
              {field.name}: {field.type}
              {field.nullable && '?'}
            </text>
          </g>
        ))}
      </g>
    );
  };

  const renderRelationship = (relationship: Relationship) => {
    const fromEntity = currentEntities.find(e => e.name === relationship.from);
    const toEntity = currentEntities.find(e => e.name === relationship.to);

    if (!fromEntity || !toEntity) return null;

    const fromX = fromEntity.position.x + 200;
    const fromY = fromEntity.position.y + (40 + fromEntity.fields.length * 20) / 2;
    const toX = toEntity.position.x;
    const toY = toEntity.position.y + (40 + toEntity.fields.length * 20) / 2;

    // Calculate control points for curved line
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    const controlOffset = 50;

    const pathData = `M ${fromX} ${fromY} Q ${midX + controlOffset} ${midY} ${toX} ${toY}`;

    return (
      <g key={`${relationship.from}-${relationship.to}`}>
        {/* Relationship Line */}
        <path
          d={pathData}
          stroke="#6b7280"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
        />

        {/* Relationship Label */}
        <text
          x={midX}
          y={midY - 10}
          textAnchor="middle"
          className="fill-gray-600 text-xs font-medium"
        >
          {relationship.label || relationship.type}
        </text>

        {/* Cardinality Indicators */}
        <text
          x={fromX + 10}
          y={fromY - 5}
          className="fill-gray-600 text-xs"
        >
          {relationship.type === 'one-to-one' ? '1' : relationship.type === 'one-to-many' ? '1' : 'N'}
        </text>
        <text
          x={toX - 10}
          y={toY - 5}
          textAnchor="end"
          className="fill-gray-600 text-xs"
        >
          {relationship.type === 'one-to-one' ? '1' : relationship.type === 'one-to-many' ? 'N' : 'M'}
        </text>
      </g>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`database-visualizer ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}
    >
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Database Schema</h3>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleZoom(0.1)}
            className="p-2 rounded-lg bg-background hover:bg-muted transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleZoom(-0.1)}
            className="p-2 rounded-lg bg-background hover:bg-muted transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetView}
            className="p-2 rounded-lg bg-background hover:bg-muted transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-background hover:bg-muted transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div
        className="relative border border-border rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted/20"
        style={{ height: isFullscreen ? 'calc(100dvh - 120px)' : '500px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="cursor-move"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center'
          }}
        >
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#6b7280"
              />
            </marker>
          </defs>

          {/* Render relationships first (behind entities) */}
          {currentRelationships.map(renderRelationship)}

          {/* Render entities */}
          {currentEntities.map(renderEntity)}
        </svg>

        {/* Zoom indicator */}
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-sm text-muted-foreground">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-semibold text-foreground mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Primary Key</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Foreign Key</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-gray-500" />
            <span>Relationship</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">1:N</span>
            <span>One to Many</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DatabaseVisualizer;