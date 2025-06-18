import React, { useState, useMemo } from 'react';
import { Icons } from '@/components/ui/icons';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

interface Task {
  client: string;
  subClient: string;
  software: string;
  softwareType: string;
  status: string;
  [key: string]: any;
}

interface TaskTableProps {
  tasks: Task[];
  onViewTask: (task: Task) => void;
  onUploadDocuments: (task: Task) => void;
}

export function TaskTable({ tasks, onViewTask, onUploadDocuments }: TaskTableProps) {
  const [filters, setFilters] = useState({
    client: 'all',
    subClient: 'all',
    software: 'all',
    softwareType: 'all',
    status: 'all'
  });

  const statusMap = {
    uploading: { label: 'Uploading', color: 'bg-yellow-200 text-yellow-800' },
    pending: { label: 'Pending', color: 'bg-yellow-200 text-yellow-800' },
    workbook: { label: 'Workbook Created', color: 'bg-green-300 text-green-900' },
    drake: { label: 'Drake Report Created', color: 'bg-green-300 text-green-900' },
    leadsheet: { label: 'Lead Sheet Created', color: 'bg-green-300 text-green-900' },
    completed: { label: 'Completed', color: 'bg-blue-300 text-blue-900' }
  };

  // Get unique values for each column
  const uniqueValues = useMemo(() => {
    return {
      clients: [...new Set(tasks.map(task => task.client))].sort(),
      subClients: [...new Set(tasks.map(task => task.subClient))].sort(),
      softwares: [...new Set(tasks.map(task => task.software))].sort(),
      softwareTypes: [...new Set(tasks.map(task => task.softwareType))].sort(),
      statuses: [...new Set(tasks.map(task => task.status))].sort()
    };
  }, [tasks]);

  // Filter tasks based on selected filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      return (
        (filters.client === 'all' || task.client === filters.client) &&
        (filters.subClient === 'all' || task.subClient === filters.subClient) &&
        (filters.software === 'all' || task.software === filters.software) &&
        (filters.softwareType === 'all' || task.softwareType === filters.softwareType) &&
        (filters.status === 'all' || task.status === filters.status)
      );
    });
  }, [tasks, filters]);

  const handleFilterChange = (column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
      <table className="min-w-full text-sm">
        <thead className="bg-muted">
          {/* Filter Row */}
          <tr className="border-b border-border">
            <th className="px-4 py-2">
              <Select
                value={filters.client}
                onValueChange={(value) => handleFilterChange('client', value)}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="All Clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {uniqueValues.clients.map(client => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </th>
            <th className="px-4 py-2">
              <Select
                value={filters.subClient}
                onValueChange={(value) => handleFilterChange('subClient', value)}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="All Sub Clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sub Clients</SelectItem>
                  {uniqueValues.subClients.map(subClient => (
                    <SelectItem key={subClient} value={subClient}>
                      {subClient}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </th>
            <th className="px-4 py-2">
              <Select
                value={filters.software}
                onValueChange={(value) => handleFilterChange('software', value)}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="All Software" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Software</SelectItem>
                  {uniqueValues.softwares.map(software => (
                    <SelectItem key={software} value={software}>
                      {software}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </th>
            <th className="px-4 py-2">
              <Select
                value={filters.softwareType}
                onValueChange={(value) => handleFilterChange('softwareType', value)}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueValues.softwareTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </th>
            <th className="px-4 py-2">
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusMap).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
          </tr>
          {/* Header Row */}
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Client</th>
            <th className="px-4 py-2 text-left font-semibold">Sub Client</th>
            <th className="px-4 py-2 text-left font-semibold">Tax Software Name</th>
            <th className="px-4 py-2 text-left font-semibold">Software Type</th>
            <th className="px-4 py-2 text-left font-semibold">Process</th>
            <th className="px-4 py-2 text-left font-semibold">View</th>
            <th className="px-4 py-2 text-left font-semibold">Update Documents</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                No tasks found matching the selected filters.
              </td>
            </tr>
          ) : (
            filteredTasks.map((task, idx) => (
              <tr key={idx} className="border-t border-border hover:bg-muted/50">
                <td className="px-4 py-2">{task.client}</td>
                <td className="px-4 py-2">{task.subClient}</td>
                <td className="px-4 py-2">{task.software}</td>
                <td className="px-4 py-2">{task.softwareType}</td>
                <td className="px-4 py-2">
                  <span className={`rounded px-3 py-1 font-medium ${statusMap[task.status].color}`}>
                    {statusMap[task.status].label}
                  </span>
                </td>
                <td className="px-4 py-2 align-middle">
                  <div className="flex h-full gap-2">
                    <button
                      className="flex items-center justify-center rounded p-1 hover:bg-muted"
                      onClick={() => onViewTask(task)}
                      title="View Task Details"
                    >
                      <Icons.view className="h-5 w-5" />
                    </button>
                    <button 
                      className="flex items-center justify-center rounded p-1 hover:bg-muted"
                      title="Download Task"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <button
                    className="flex gap-2 rounded border-2 p-2 hover:bg-muted"
                    title="Upload Documents"
                    onClick={() => onUploadDocuments(task)}
                  >
                    <Icons.upload className="h-5 w-5" />
                    <b>Upload</b>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}