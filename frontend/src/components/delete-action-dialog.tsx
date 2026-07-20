import type { ReactNode } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteActionDialogProps {
  title: ReactNode;
  description: ReactNode;
  confirmLabel: string;
  isDeleting: boolean;
  onConfirm: () => void | Promise<void>;
  disabled?: boolean;
}

export const DeleteActionDialog = ({
  title,
  description,
  confirmLabel,
  isDeleting,
  onConfirm,
  disabled = false,
}: DeleteActionDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type='button'
            variant='destructive'
            size='sm'
            disabled={disabled || isDeleting}
          />
        }
      >
        {isDeleting ? (
          <Loader2 className='size-4 animate-spin' />
        ) : (
          <Trash2 className='size-4' />
        )}

        {isDeleting ? 'Deleting...' : 'Delete'}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            type='button'
            variant='destructive'
            disabled={isDeleting}
            onClick={() => void onConfirm()}
          >
            {isDeleting ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                Deleting...
              </>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
