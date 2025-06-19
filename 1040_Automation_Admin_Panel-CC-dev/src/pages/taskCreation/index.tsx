import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Icons } from '@/components/ui/icons';
import ViewTaskModal from './components/view-task-modal';
import { mockTimeline } from './data';
import { TaskCreationForm } from './components/task-creation-form';
import { ComboBox } from '@/components/ui/combobox';
import DataTable from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { TypesProvider } from '@/contexts/TypesContext';
import { getTasksById } from '@/services/taskService';


// Add Task Button Component
function AddTaskButton({ onClick }) {
  return (

    <Button
      onClick={onClick}
      className="flex items-center gap-2"
    >
      <Icons.add className="h-4 w-4" />
      Add Task
    </Button>

  );
}

// Task Table Component
function TaskTable({ tasks, onViewTask }) {
  const statusMap = {
    uploading: { label: 'Uploading', color: 'bg-yellow-200 text-yellow-800' },
    pending: { label: 'Pending', color: 'bg-yellow-200 text-yellow-800' },
    workbook: {
      label: 'Workbook Created',
      color: 'bg-green-300 text-green-900'
    },
    drake: {
      label: 'Drake Report Created',
      color: 'bg-green-300 text-green-900'
    },
    leadsheet: {
      label: 'Lead Sheet Created',
      color: 'bg-green-300 text-green-900'
    },
    completed: { label: 'Completed', color: 'bg-blue-300 text-blue-900' }
  };

  const [filters, setFilters] = React.useState({
    client: '',
    subClient: '',
    companyName: '',
    software: '',
    softwareType: '',
    status: ''
  });

  const uniqueValues = React.useMemo(() => {
    return {
      clients: Array.from(
        new Set(tasks.map((t) => t.client).filter(Boolean))
      ) as string[],
      subClients: Array.from(
        new Set(tasks.map((t) => t.subClient).filter(Boolean))
      ) as string[],
      companies: Array.from(
        new Set(tasks.map((t) => t.companyName).filter(Boolean))
      ) as string[],
      softwares: Array.from(
        new Set(tasks.map((t) => t.software).filter(Boolean))
      ) as string[],
      softwareTypes: Array.from(
        new Set(tasks.map((t) => t.softwareType).filter(Boolean))
      ) as string[],
      statuses: Array.from(
        new Set(tasks.map((t) => t.status).filter(Boolean))
      ) as string[]
    };
  }, [tasks]);

  const filteredTasks = tasks.filter(
    (task) =>
      (!filters.client ||
        task.client?.toLowerCase().includes(filters.client.toLowerCase())) &&
      (!filters.subClient ||
        task.subClient
          ?.toLowerCase()
          .includes(filters.subClient.toLowerCase())) &&
      (!filters.companyName ||
        task.companyName
          ?.toLowerCase()
          .includes(filters.companyName.toLowerCase())) &&
      (!filters.software ||
        task.software
          ?.toLowerCase()
          .includes(filters.software.toLowerCase())) &&
      (!filters.softwareType ||
        task.softwareType
          ?.toLowerCase()
          .includes(filters.softwareType.toLowerCase())) &&
      (!filters.status ||
        statusMap[task.status]?.label
          .toLowerCase()
          .includes(filters.status.toLowerCase()))
  );

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  // Define columns for DataTable
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'client',
      header: () => (
        <div className="flex flex-col gap-1">
          
          <span>Client</span>
        </div>
      ),
      cell: (info) => info.getValue()
    },
    {
      accessorKey: 'subClient',
      header: () => (
        <div className="flex flex-col gap-1">
          
          <span>Sub Client</span>
        </div>
      ),
      cell: (info) => info.getValue()
    },
    {
      accessorKey: 'companyName',
      header: () => (
        <div className="flex flex-col gap-1">
          
          <span>Company</span>
        </div>
      ),
      cell: (info) => info.getValue()
    },
    {
      accessorKey: 'software',
      header: () => (
        <div className="flex flex-col gap-1">
          
          <span>Tax Software</span>
        </div>
      ),
      cell: (info) => info.getValue()
    },
    {
      accessorKey: 'softwareType',
      header: () => (
        <div className="flex flex-col gap-1">
          
          <span>Software Type</span>
        </div>
      ),
      cell: (info) => info.getValue()
    },
    {
      accessorKey: 'status',
      header: () => (
        <div className="flex flex-col gap-1">
          
          <span>Filing Status</span>
        </div>
      ),
      cell: (info) => (
        <span
          className={`rounded px-3 py-1 font-medium ${info.getValue() === 'Unknown' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'
            }`}
        >
          {String(info.getValue())}
        </span>
      )
    },
    {
      id: 'view',
      header: 'View',
      cell: (info) => (
        <div className="flex h-full gap-2">
          <button
            className="flex items-center justify-center rounded p-1 hover:bg-muted"
            onClick={() => onViewTask(info.row.original)}
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
      )
    },
    {
      id: 'upload',
      header: 'Update Documents',
      cell: (info) => (
        <button
          className="flex gap-2 rounded  p-2 hover:bg-muted"
          title="Upload Documents"
        >
          <Icons.upload className="h-5 w-5" />
          
        </button>
      )
    }
  ];

  return (
    <div>
      <div className=" px-4 pb-2 pt-4 flex gap-2">
        <ComboBox
            value={filters.client}
            options={uniqueValues.clients}
            placeholder="Filter Client"
            onChange={(value) => handleFilterChange('client', value)}

          />
          <ComboBox
            value={filters.subClient}
            options={uniqueValues.subClients}
            placeholder="Filter Sub Client"
            onChange={(value) => handleFilterChange('subClient', value)}
            
          />
          <ComboBox
            value={filters.companyName}
            options={uniqueValues.companies}
            placeholder="Filter Company"
            onChange={(value) => handleFilterChange('companyName', value)}
            
          />
          
          <ComboBox
            value={filters.software}
            options={uniqueValues.softwares}
            placeholder="Filter Tax Software"
            onChange={(value) => handleFilterChange('software', value)}
          
          />
          <ComboBox
            value={filters.softwareType}
            options={uniqueValues.softwareTypes}
            placeholder="Filter Network Access"
            onChange={(value) => handleFilterChange('softwareType', value)}
          
          />
          <ComboBox
            value={filters.status}
            options={uniqueValues.statuses}
            placeholder="Filter Status"
            onChange={(value) => handleFilterChange('status', value)}
           
          />
          
      </div>
    <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
      
      <DataTable columns={columns} data={filteredTasks} pageCount={1} />
    </div>
    </div>

  );
}

// Task Creation Modal Component
function TaskCreationModal({ open, onOpenChange, onTaskCreated }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-full w-full max-w-5xl overflow-y-auto">
        <TaskCreationForm
          onTaskCreated={onTaskCreated}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

// Main Component
export default function TaskManagement() {
  const { user } = useAuth();
  type Task = {
    client: string;
    subClient: string;
    software: string;
    softwareType: string;
    status: string;
    lastProcessDate: string;
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!user?.id) {
          console.error('No user ID available');
          return;
        }
        const data = await getTasksById(String(user.id));
        // Map the API response to match our table structure
        const formattedTasks = data.map(task => ({
          client: task.client,
          subClient: task.subClient,
          companyName: task.company,
          software: task.taxSoftwareName,
          softwareType: task.softwareType,
          status: task.filingStatus || 'pending',
          lastProcessDate: task.lastProcessDate
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setViewModalOpen(true);
  };

  return (
    <TypesProvider>
      <div className="min-h-screen bg-gray-50 px-8 py-12">
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Task Management
          </h2>
          <AddTaskButton onClick={() => setOpen(true)} />
        </div>
        <hr className="my-6 border-gray-300" />
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Icons.spinner className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <TaskTable tasks={tasks} onViewTask={handleViewTask} />
        )}
        <TaskCreationModal
          open={open}
          onOpenChange={setOpen}
          onTaskCreated={handleTaskCreated}
        />
        <ViewTaskModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          selectedTask={selectedTask}
          timeline={mockTimeline}
        />
      </div>
    </TypesProvider>
  );
}
