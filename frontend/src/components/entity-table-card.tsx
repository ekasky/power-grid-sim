import { AlertError } from '@/components/alert-error';
import { EmptyMessage } from '@/components/empty-message';
import { LoadingMessage } from '@/components/loading-message';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Entity } from '@/hooks/use-entity-list';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface EntityTableCardProps<T extends Entity> {
  title: string;
  description: ReactNode;

  createLabel: string;
  createTo: string;

  data: T[];
  columns: ColumnDef<T>[];

  isLoading: boolean;
  loadingMessage: string;

  loadError: string | null;
  loadErrorTitle: string;

  deleteError: string | null;
  deleteErrorTitle: string;

  emptyMessage: string;

  toolbar?: ReactNode;
}

export function EntityTableCard<T extends Entity>({
  title,
  description,
  createLabel,
  createTo,
  data,
  columns,
  isLoading,
  loadingMessage,
  loadError,
  loadErrorTitle: loadingErrorTitle,
  deleteError,
  deleteErrorTitle,
  emptyMessage,
  toolbar,
}: EntityTableCardProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable<T>({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card>
      <CardHeader className='gap-4'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>

          <Button render={<Link to={createTo}>{createLabel}</Link>} />
        </div>

        {toolbar}
      </CardHeader>

      <CardContent>
        {deleteError && (
          <AlertError title={deleteErrorTitle} error={deleteError} />
        )}

        {loadError && (
          <AlertError title={loadingErrorTitle} error={loadError} />
        )}

        {isLoading ? (
          <LoadingMessage message={loadingMessage} />
        ) : loadError ? null : data.length === 0 ? (
          <EmptyMessage message={emptyMessage} />
        ) : (
          <div className='overflow-hidden rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className='whitespace-nowrap'>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className='whitespace-nowrap'>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
