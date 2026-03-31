import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';

interface ConfirmDialogProps {
  open: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, itemName, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete &ldquo;{itemName}&rdquo;?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-500">This action cannot be undone.</p>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
