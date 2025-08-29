import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Download,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  MoreHorizontal
} from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  exportable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: any) => void;
  onCellAction?: (action: string, row: any, column: Column) => void;
  className?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  loading = false,
  searchable = true,
  filterable = true,
  sortable = true,
  exportable = true,
  pagination = true,
  pageSize = 10,
  onRowClick,
  onCellAction,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map(col => col.key))
  );

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = data.filter(row => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = columns.some(col => {
          const value = row[col.key]?.toString().toLowerCase() || '';
          return value.includes(searchLower);
        });
        if (!matchesSearch) return false;
      }

      // Column filters
      for (const [columnKey, filterValue] of Object.entries(filters)) {
        if (filterValue) {
          const value = row[columnKey]?.toString().toLowerCase() || '';
          if (!value.includes(filterValue.toLowerCase())) {
            return false;
          }
        }
      }

      return true;
    });

    // Sort data
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal === bVal) return 0;

        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [data, searchTerm, filters, sortColumn, sortDirection, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;

    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleFilter = (columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
    setCurrentPage(1);
  };

  const handleExport = (format: 'csv' | 'json') => {
    const exportData = filteredData.map(row =>
      columns.reduce((acc, col) => {
        if (visibleColumns.has(col.key)) {
          acc[col.label] = row[col.key];
        }
        return acc;
      }, {} as Record<string, any>)
    );

    if (format === 'csv') {
      const csv = [
        Object.keys(exportData[0] || {}).join(','),
        ...exportData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data-export.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data-export.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="data-table-loading">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`data-table ${className}`}>
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
        {/* Search */}
        {searchable && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        )}

        {/* Export */}
        {exportable && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExport('csv')}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              <Download className="w-4 h-4 mr-1" />
              CSV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExport('json')}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm"
            >
              <Download className="w-4 h-4 mr-1" />
              JSON
            </motion.button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-muted/50">
              <tr>
                {columns.map(column => (
                  visibleColumns.has(column.key) && (
                    <th
                      key={column.key}
                      className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border"
                      style={{ width: column.width }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{column.label}</span>

                        <div className="flex items-center gap-1">
                          {/* Sort button */}
                          {sortable && column.sortable !== false && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleSort(column.key)}
                              className="p-1 hover:bg-muted rounded"
                            >
                              {sortColumn === column.key ? (
                                sortDirection === 'asc' ? (
                                  <SortAsc className="w-4 h-4" />
                                ) : (
                                  <SortDesc className="w-4 h-4" />
                                )
                              ) : (
                                <ChevronDown className="w-4 h-4 opacity-50" />
                              )}
                            </motion.button>
                          )}

                          {/* Filter input */}
                          {filterable && column.filterable !== false && (
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Filter..."
                                value={filters[column.key] || ''}
                                onChange={(e) => handleFilter(column.key, e.target.value)}
                                className="w-20 px-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                  )
                ))}

                {/* Column visibility toggle */}
                <th className="px-4 py-3 text-right">
                  <div className="dropdown relative">
                    <button className="p-1 hover:bg-muted rounded">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <div className="dropdown-menu absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg p-2 z-10 min-w-48">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">Columns</div>
                      {columns.map(column => (
                        <label key={column.key} className="flex items-center gap-2 py-1 text-sm">
                          <input
                            type="checkbox"
                            checked={visibleColumns.has(column.key)}
                            onChange={() => toggleColumnVisibility(column.key)}
                            className="rounded"
                          />
                          {column.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              <AnimatePresence>
                {paginatedData.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`border-b border-border hover:bg-muted/50 transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map(column => (
                      visibleColumns.has(column.key) && (
                        <td key={column.key} className="px-4 py-3 text-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              {column.render ? (
                                column.render(row[column.key], row)
                              ) : (
                                <span className="truncate block" title={row[column.key]?.toString()}>
                                  {row[column.key]?.toString() || '-'}
                                </span>
                              )}
                            </div>

                            {/* Cell actions */}
                            <div className="flex items-center gap-1 ml-2">
                              {row[column.key] && (
                                <>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(row[column.key]?.toString() || '');
                                      onCellAction?.('copy', row, column);
                                    }}
                                    className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Copy"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </motion.button>

                                  {column.key === 'email' && (
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`mailto:${row[column.key]}`, '_blank');
                                        onCellAction?.('email', row, column);
                                      }}
                                      className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                      title="Send email"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </motion.button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      )
                    ))}

                    <td className="px-4 py-3">
                      {/* Row actions */}
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCellAction?.('view', row, { key: 'actions', label: 'Actions' });
                          }}
                          className="p-1 hover:bg-muted rounded"
                          title="View details"
                        >
                          <Eye className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} results
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </motion.button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;