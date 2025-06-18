
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TaskCreationForm } from './task-creation-form';



export function TaskCreationModal({ open, onOpenChange, onTaskCreated }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-full w-full max-w-5xl overflow-y-auto">
        <TaskCreationForm onTaskCreated={onTaskCreated} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
