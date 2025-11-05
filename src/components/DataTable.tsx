import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown, Download, Filter, Eye } from "lucide-react";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  searchable?: boolean;
  exportable?: boolean;
}

export const DataTable = ({ columns, data, onRowClick, searchable = true, exportable = true }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const exportToCSV = () => {
    const headers = columns.map(col => col.label).join(',');
    const rows = sortedData.map(row =>
      columns.map(col => row[col.key]).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-export.csv';
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {exportable && (
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead key={column.key} className="font-semibold">
                  {column.sortable !== false ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center space-x-1 hover:text-primary transition-colors"
                    >
                      <span>{column.label}</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? "cursor-pointer hover:bg-accent transition-colors" : ""}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {renderCell(row[column.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {sortedData.length} of {data.length} entries
      </div>
    </div>
  );
};

const renderCell = (value: any) => {
  if (typeof value === 'boolean') {
    return value ? '✓' : '✗';
  }
  
  if (typeof value === 'number' && value > 0 && value <= 100) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-muted rounded-full h-2 max-w-[100px]">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${value}%` }}
          />
        </div>
        <span>{value}%</span>
      </div>
    );
  }
  
  return String(value);
};
