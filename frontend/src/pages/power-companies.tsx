import {
  deletePowerCompany,
  getPowerCompanies,
  type PowerCompany,
} from '@/api/power-companies';
import { DeleteActionDialog } from '@/components/delete-action-dialog';
import { EditPowerCompanyDialog } from '@/components/edit-power-company-dialog';
import { SortableHeader } from '@/components/sortable-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { currencyFormatter, rateFormatter } from '@/lib/formatters';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PowerCompanies = () => {
  const columns: ColumnDef<PowerCompany>[] = [
    {
      accessorKey: 'longName',
      header: ({ column }) => (
        <SortableHeader column={column} title='Company Name' />
      ),
      cell: ({ row }) => (
        <span className='font-medium'>{row.original.longName}</span>
      ),
    },
    {
      accessorKey: 'shortName',
      header: ({ column }) => (
        <SortableHeader column={column} title='Short Name' />
      ),
    },
    {
      id: 'standardRate',
      accessorFn: (company) => Number(company.standardRate),
      header: ({ column }) => (
        <SortableHeader column={column} title='Standard Rate' />
      ),
      cell: ({ row }) => (
        <span>
          {rateFormatter.format(Number(row.original.standardRate))} / kWh
        </span>
      ),
    },
    {
      id: 'totalRevene',
      accessorFn: (company) => Number(company.totalRevenue ?? 0),
      header: ({ column }) => (
        <SortableHeader column={column} title='Total Revenue' />
      ),
      cell: ({ row }) =>
        row.original.totalRevenue === undefined
          ? '--'
          : currencyFormatter.format(Number(row.original.totalRevenue)),
    },
    {
      id: 'totalCosts',
      accessorFn: (company) => Number(company.totalCosts ?? 0),
      header: ({ column }) => <SortableHeader column={column} title='Costs' />,
      cell: ({ row }) =>
        row.original.totalCosts === undefined
          ? '--'
          : currencyFormatter.format(Number(row.original.totalCosts)),
    },
    {
      id: 'location',
      accessorFn: (company) =>
        company.location ? `${company.location.x},${company.location.y}` : '',
      header: ({ column }) => (
        <SortableHeader column={column} title='Location' />
      ),
      cell: ({ row }) =>
        row.original.location
          ? `(${row.original.location.x}, ${row.original.location.y})`
          : '',
    },
    {
      id: 'actions',
      enableSorting: false,
      header: () => <div className='text-right'>Actions</div>,
      cell: ({ row }) => {
        const company = row.original;
        const isDeleting = deletingCompanyId === company.id;

        return (
          <div className='flex justify-end gap-2'>
            <EditPowerCompanyDialog
              company={company}
              onUpdated={handlePowerCompanyUpdated}
            />

            <DeleteActionDialog
              title={`Delete ${company.id}?`}
              description={
                <>
                  This action cannot be undone. The power plant will be
                  permanently removed from{' '}
                  {company.longName ?? 'the power company'}.
                </>
              }
              confirmLabel='Delete Power Plant'
              isDeleting={isDeleting}
              onConfirm={() => handleDeletePowerCompany(company)}
            />
          </div>
        );
      },
    },
  ];

  const [powerCompanies, setPowerCompanies] = useState<PowerCompany[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeletePowerCompany = async (company: PowerCompany) => {
    try {
      setDeletingCompanyId(company.id);
      setDeleteError(null);

      await deletePowerCompany(company.id);

      setPowerCompanies((currentCompanies) =>
        currentCompanies.filter(
          (currentCompany) => currentCompany.id !== company.id,
        ),
      );
    } catch (error: unknown) {
      console.error(error);

      setDeleteError(
        error instanceof Error
          ? error.message
          : 'Unable to delete the power company',
      );
    } finally {
      setDeletingCompanyId(null);
    }
  };

  const handlePowerCompanyUpdated = (updatedCompany: PowerCompany) => {
    setPowerCompanies((currentCompanies) =>
      currentCompanies.map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company,
      ),
    );
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadPowerCompanies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const companies = await getPowerCompanies(controller.signal);

        if (!controller.signal.aborted) {
          setPowerCompanies(companies);
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);

        if (!controller.signal.aborted) {
          setError(
            error instanceof Error
              ? error.message
              : 'Unable to load power companies',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadPowerCompanies();

    return () => {
      controller.abort();
    };
  }, []);

  const table = useReactTable({
    data: powerCompanies,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Power Companies</h1>
        <p className='mt-1 text-muted-foreground'>
          View and sort all power companies in the simulation
        </p>
      </div>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>All Power Companies</CardTitle>

            <CardDescription>
              {powerCompanies.length}{' '}
              {powerCompanies.length === 1 ? 'company' : 'companies'} in the
              simulation.
            </CardDescription>
          </div>
          <div>
            <Button
              render={
                <Link to='/create-power-company'>Create Power Company</Link>
              }
            ></Button>
          </div>
        </CardHeader>

        <CardContent>
          {deleteError && (
            <Alert variant='destructive' className='mb-4'>
              <AlertTitle>Unable to delete power company</AlertTitle>
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className='flex min-h-48 items-center justify-center gap-2 text-muted-foreground'>
              <Loader2 className='size-5 animate-spin' />
              Loading power companies...
            </div>
          ) : error ? (
            <Alert variant='destructive'>
              <AlertTitle>Unable to load power companies</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className='overflow-hidden rounded-md border'>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className='whitespace-nowrap'
                        >
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
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className='whitespace-nowrap'
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className='h-32 text-center text-muted-foreground'
                      >
                        No power companies have been created.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PowerCompanies;
