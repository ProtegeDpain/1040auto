import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';

// Timeline item type
type TimelineItem = {
  label: string;
  date: string;
  icon: React.ReactNode;
  downloadable: boolean;
  active: boolean;
  downloadLabel: string;
};

interface ViewTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: any;
  timeline: TimelineItem[];
}

const ViewTaskModal: React.FC<ViewTaskModalProps> = ({
  open,
  onOpenChange,
  selectedTask,
  timeline
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-background p-0">
        <DialogHeader className="px-12 pt-10">
          <DialogTitle className="mb-4 text-3xl font-bold">
            Client & Document Overview
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-12 px-12 pb-12 md:flex-row md:gap-12">
          {/* Left: Client/SubClient Info */}
          <Card className="mb-8 flex-1 rounded-xl border border-border bg-white p-8 shadow md:mb-0">
            <div className="space-y-6">
              <div>
                <div className="mb-1 text-xs text-muted-foreground">
                  Sub Client Name
                </div>
                <div className="break-words text-lg font-semibold text-foreground md:text-xl">
                  {selectedTask?.subClient}
                </div>
              </div>
              <Separator />
              <div>
                <div className="mb-1 text-xs text-muted-foreground">
                  Client Name
                </div>
                <div className="break-words text-lg font-semibold text-foreground md:text-xl">
                  {selectedTask?.client}
                </div>
              </div>
              <Separator />
              <div>
                <div className="mb-1 text-xs text-muted-foreground">
                  Last Process Date of Document
                </div>
                <div className="break-words text-lg font-semibold text-foreground md:text-xl">
                  {selectedTask?.lastProcessDate}
                </div>
              </div>
            </div>
          </Card>
          {/* Right: Timeline */}
          <div className="flex flex-1 justify-center">
            <Card className="relative flex w-full max-w-full flex-col gap-10 rounded-xl border border-border bg-white p-8 shadow">
              {/* Timeline vertical line */}
              <div className="absolute left-8 z-0 w-1 rounded-full bg-gray-200 md:left-12" />
              <div className="relative flex  flex-col">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-10">
                    {/* Timeline icon */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full border-4 md:h-16 md:w-16 ${
                          item.active
                            ? 'border-green-500 bg-white'
                            : 'border-gray-300 bg-gray-100'
                        }`}
                      >
                        {item.icon}
                      </div>
                      {/* Vertical connector */}
                      {idx < timeline.length - 1 && (
                        <div className="h-10 w-0.5 bg-gray-200" />
                      )}
                    </div>
                    {/* Date and label */}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs text-muted-foreground">
                        {item.date}
                      </div>
                      <div
                        className={`truncate text-base font-semibold md:text-lg ${
                          item.active ? 'text-green-700' : 'text-gray-400'
                        }`}
                      >
                        {item.label}
                      </div>
                    </div>
                    {/* Download buttons */}
                    {item.downloadable && (
                      <Button
                        variant={item.active ? 'default' : 'secondary'}
                        className={`flex w-fit items-center justify-center gap-3 text-base font-semibold ${
                          item.active
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'cursor-not-allowed bg-gray-200 text-gray-400'
                        }`}
                        disabled={!item.active}
                      >
                        <Icons.download className="h-6 w-6" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTaskModal;
