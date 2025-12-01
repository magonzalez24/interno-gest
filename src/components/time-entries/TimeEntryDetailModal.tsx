import type { TimeEntry } from '@/types/database';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface TimeEntryDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: TimeEntry | null;
}

export const TimeEntryDetailModal = ({
  open,
  onOpenChange,
  entry,
}: TimeEntryDetailModalProps) => {
  if (!entry) {
    return null;
  }

  const projectName = entry.project?.name ?? 'Proyecto sin nombre';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2">
            <span>Detalle de imputación</span>
            <Badge variant="outline">{entry.hours} horas</Badge>
          </DialogTitle>
          <DialogDescription>
            {formatDate(entry.date)} · {projectName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Proyecto
            </p>
            <p className="text-sm font-medium">{projectName}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Fecha
            </p>
            <p className="text-sm">{formatDate(entry.date)}</p>
          </div>

          {entry.description && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Descripción
              </p>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {entry.description}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};


