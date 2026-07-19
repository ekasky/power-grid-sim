import { Button } from '@/components/ui/button';
import { type Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

interface SortableHeaderProps<TDate, TValue> {
  column: Column<TDate, TValue>;
  title: string;
}

export const SortableHeader = <TDate, TValue>({
  column,
  title,
}: SortableHeaderProps<TDate, TValue>) => {
  const sortDirection = column.getIsSorted();

  return (
    <Button
      type='button'
      variant='ghost'
      className='-ml-3 h-8'
      onClick={column.getToggleSortingHandler()}
    >
      {title}

      {sortDirection === 'asc' ? (
        <ArrowUp className='size-4' />
      ) : sortDirection === 'desc' ? (
        <ArrowDown className='size-4' />
      ) : (
        <ArrowUpDown className='size-4' />
      )}
    </Button>
  );
};
