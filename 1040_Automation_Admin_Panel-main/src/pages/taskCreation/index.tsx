import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import ViewTaskModal from './components/view-task-modal';
import { usStates } from '@/lib/us-states';
import { companyClientList, initialFormState, initialMockTasks, mockTimeline, softwareTypes, subClientList } from './data';
import { TaskCreationForm } from './components/task-creation-form';


// Add Task Button Component
function AddTaskButton({ onClick }) {
  return (
    <Button
      onClick={onClick}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
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
    workbook: { label: 'Workbook Created', color: 'bg-green-300 text-green-900' },
    drake: { label: 'Drake Report Created', color: 'bg-green-300 text-green-900' },
    leadsheet: { label: 'Lead Sheet Created', color: 'bg-green-300 text-green-900' },
    completed: { label: 'Completed', color: 'bg-blue-300 text-blue-900' }
  };

  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
      <table className="min-w-full text-sm">
        <thead className="bg-muted">
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
          {tasks.map((task, idx) => (
            <tr key={idx} className="border-t border-border">
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
                  >
                    <Icons.view className="h-5 w-5" />
                  </button>
                  <button className="flex items-center justify-center rounded p-1 hover:bg-muted">
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
                >
                  <Icons.upload className="h-5 w-5" />
                  <b>Upload</b>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Task Creation Modal Component
function TaskCreationModal({ open, onOpenChange, onTaskCreated }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-full w-full max-w-5xl overflow-y-auto">
        <TaskCreationForm onTaskCreated={onTaskCreated} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

// Main Component
export default function TaskManagement() {
  const [tasks, setTasks] = useState(initialMockTasks);
  const [open, setOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setViewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-12">
      <div className="mb-2 flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Task Management
        </h2>
        <AddTaskButton onClick={() => setOpen(true)} />
      </div>
      <hr className="my-6 border-gray-300" />
      <TaskTable tasks={tasks} onViewTask={handleViewTask} />
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
  );
}