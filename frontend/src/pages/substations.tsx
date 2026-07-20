import { getPowerCompanies, type PowerCompany } from '@/api/power-companies';
import { getPowerPlants, type PowerPlant } from '@/api/power-plants';
import {
  deletePowerSubstation,
  getPowerSubstations,
  type PowerSubstation,
} from '@/api/power-substations';
import { SortableHeader } from '@/components/sortable-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { currencyFormatter } from '@/lib/formatters';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { Loader2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Substations = () => {
  const [powerCompanies, setPowerCompanies] = useState<PowerCompany[]>([]);
  const [powerPlants, setPowerPlants] = useState<PowerPlant[]>([]);
  const [substations, setSubstations] = useState<PowerSubstation[]>([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  const [sorting, setSorting] = useState<SortingState>([]);

  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [isLoadingPlants, setIsLoadingPlants] = useState(false);
  const [isLoadingSubstations, setIsLoadingSubstations] = useState(false);

  const [companyError, setCompanyError] = useState<string | null>(null);
  const [plantError, setPlantError] = useState<string | null>(null);
  const [substationError, setSubstationError] = useState<string | null>(null);

  const [deletingSubstationId, setDeletingSubstationId] = useState<
    string | null
  >(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const selectedCompany = powerCompanies.find(
    (company) => company.id === selectedCompanyId,
  );

  const selectedPlant = powerPlants.find(
    (plant) => plant.id === selectedPlantId,
  );

  const handleDeleteSubstation = async (substation: PowerSubstation) => {
    try {
      setDeletingSubstationId(substation.id);
      setDeleteError(null);

      await deletePowerSubstation(substation.id);

      setSubstations((currentSubstations) =>
        currentSubstations.filter(
          (currentSubstation) => currentSubstation.id !== substation.id,
        ),
      );
    } catch (error: unknown) {
      console.error(error);

      setDeleteError(
        error instanceof Error
          ? error.message
          : 'Unable to delete the power substation.',
      );
    } finally {
      setDeletingSubstationId(null);
    }
  };

  const columns: ColumnDef<PowerSubstation>[] = [
    {
      accessorKey: 'substationId',
      header: ({ column }) => (
        <SortableHeader column={column} title='Substation ID' />
      ),
      cell: ({ row }) => (
        <span className='font-medium'>{row.original.substationId}</span>
      ),
    },
    {
      id: 'initialInstallationCost',
      accessorFn: (substation) => Number(substation.initialInstallationCost),
      header: ({ column }) => (
        <SortableHeader column={column} title='Installation Cost' />
      ),
      cell: ({ row }) =>
        currencyFormatter.format(Number(row.original.initialInstallationCost)),
    },
    {
      id: 'recurringMaintenanceCost',
      accessorFn: (substation) => Number(substation.recurringMaintenanceCost),
      header: ({ column }) => (
        <SortableHeader column={column} title='Maintenance Cost' />
      ),
      cell: ({ row }) =>
        currencyFormatter.format(Number(row.original.recurringMaintenanceCost)),
    },
    {
      id: 'location',
      accessorFn: (substation) =>
        `${substation.location.x},${substation.location.y}`,
      header: ({ column }) => (
        <SortableHeader column={column} title='Location' />
      ),
      cell: ({ row }) =>
        `(${row.original.location.x}, ${row.original.location.y})`,
    },
    {
      id: 'actions',
      enableSorting: false,
      header: () => <div className='text-right'>Actions</div>,
      cell: ({ row }) => {
        const substation = row.original;
        const isDeleting = deletingSubstationId === substation.id;

        return (
          <div className='flex justify-end gap-2'>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    type='button'
                    variant='destructive'
                    size='sm'
                    disabled={isDeleting}
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
                  <AlertDialogTitle>
                    Delete {substation.substationId}?
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    This action cannot be undone. The substation will be
                    permanently removed from{' '}
                    {selectedPlant?.plantId ?? 'the power plant'}.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    variant='destructive'
                    disabled={isDeleting}
                    onClick={() => void handleDeleteSubstation(substation)}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Substation'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  /*
   * Load companies when the page opens.
   */
  useEffect(() => {
    const controller = new AbortController();

    const loadPowerCompanies = async () => {
      try {
        setIsLoadingCompanies(true);
        setCompanyError(null);

        const companies = await getPowerCompanies(controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setPowerCompanies(companies);
        setSelectedCompanyId(companies[0]?.id ?? null);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);

        if (!controller.signal.aborted) {
          setCompanyError(
            error instanceof Error
              ? error.message
              : 'Unable to load power companies.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCompanies(false);
        }
      }
    };

    void loadPowerCompanies();

    return () => {
      controller.abort();
    };
  }, []);

  /*
   * Load the selected company's plants.
   */
  useEffect(() => {
    setSelectedPlantId(null);
    setPowerPlants([]);
    setSubstations([]);
    setPlantError(null);
    setSubstationError(null);
    setDeleteError(null);

    if (!selectedCompanyId) {
      return;
    }

    const controller = new AbortController();

    const loadPowerPlants = async () => {
      try {
        setIsLoadingPlants(true);

        const plants = await getPowerPlants(
          selectedCompanyId,
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        setPowerPlants(plants);
        setSelectedPlantId(plants[0]?.id ?? null);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);

        if (!controller.signal.aborted) {
          setPlantError(
            error instanceof Error
              ? error.message
              : 'Unable to load power plants.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingPlants(false);
        }
      }
    };

    void loadPowerPlants();

    return () => {
      controller.abort();
    };
  }, [selectedCompanyId]);

  /*
   * Load the selected plant's substations.
   */
  useEffect(() => {
    setSubstations([]);
    setSubstationError(null);
    setDeleteError(null);

    if (!selectedPlantId) {
      return;
    }

    const controller = new AbortController();

    const loadSubstations = async () => {
      try {
        setIsLoadingSubstations(true);

        const loadedSubstations = await getPowerSubstations(
          selectedPlantId,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setSubstations(loadedSubstations);
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);

        if (!controller.signal.aborted) {
          setSubstationError(
            error instanceof Error
              ? error.message
              : 'Unable to load power substations.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSubstations(false);
        }
      }
    };

    void loadSubstations();

    return () => {
      controller.abort();
    };
  }, [selectedPlantId]);

  const table = useReactTable({
    data: substations,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const companyOptions = powerCompanies.map((company) => ({
    value: company.id,
    label: `${company.longName} (${company.shortName})`,
  }));

  const plantOptions = powerPlants.map((plant) => ({
    value: plant.id,
    label: plant.plantId,
  }));

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Power Substations</h1>

        <p className='mt-1 text-muted-foreground'>
          View substations belonging to each power plant
        </p>
      </div>

      <Card>
        <CardHeader className='gap-4'>
          <div className='flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <CardTitle>Power Substations</CardTitle>

              <CardDescription>
                {selectedPlant
                  ? `${substations.length} ${
                      substations.length === 1 ? 'substation' : 'substations'
                    } assigned to ${selectedPlant.plantId}.`
                  : 'Select a power plant to view its substations.'}
              </CardDescription>
            </div>

            <Button
              disabled={!selectedPlantId}
              render={
                <Link to='/create-substation'>Create Power Substation</Link>
              }
            />
          </div>

          <div className='flex flex-col gap-3 sm:flex-row'>
            <Select
              items={companyOptions}
              value={selectedCompanyId}
              onValueChange={(value) => {
                setSelectedCompanyId(value);
              }}
              disabled={isLoadingCompanies || powerCompanies.length === 0}
            >
              <SelectTrigger className='w-full sm:w-80'>
                <SelectValue placeholder='Select a power company' />
              </SelectTrigger>

              <SelectContent>
                {powerCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.longName} ({company.shortName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              items={plantOptions}
              value={selectedPlantId}
              onValueChange={(value) => {
                setSelectedPlantId(value);
              }}
              disabled={
                isLoadingPlants ||
                !selectedCompanyId ||
                powerPlants.length === 0
              }
            >
              <SelectTrigger className='w-full sm:w-72'>
                <SelectValue placeholder='Select a power plant' />
              </SelectTrigger>

              <SelectContent>
                {powerPlants.map((plant) => (
                  <SelectItem key={plant.id} value={plant.id}>
                    {plant.plantId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {deleteError && (
            <Alert variant='destructive' className='mb-4'>
              <AlertTitle>Unable to delete power substation</AlertTitle>
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          {companyError && (
            <Alert variant='destructive' className='mb-4'>
              <AlertTitle>Unable to load power companies</AlertTitle>
              <AlertDescription>{companyError}</AlertDescription>
            </Alert>
          )}

          {plantError && (
            <Alert variant='destructive' className='mb-4'>
              <AlertTitle>Unable to load power plants</AlertTitle>
              <AlertDescription>{plantError}</AlertDescription>
            </Alert>
          )}

          {substationError && (
            <Alert variant='destructive' className='mb-4'>
              <AlertTitle>Unable to load power substations</AlertTitle>
              <AlertDescription>{substationError}</AlertDescription>
            </Alert>
          )}

          {isLoadingCompanies ? (
            <LoadingMessage message='Loading power companies...' />
          ) : powerCompanies.length === 0 ? (
            <EmptyMessage message='Create a power company before adding substations.' />
          ) : isLoadingPlants ? (
            <LoadingMessage message='Loading power plants...' />
          ) : powerPlants.length === 0 ? (
            <EmptyMessage
              message={`${selectedCompany?.longName ?? 'This company'} does not have any power plants.`}
            />
          ) : isLoadingSubstations ? (
            <LoadingMessage message='Loading power substations...' />
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
                        {selectedPlant
                          ? `${selectedPlant.plantId} does not have any substations.`
                          : 'Select a power plant.'}
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

interface LoadingMessageProps {
  message: string;
}

const LoadingMessage = ({ message }: LoadingMessageProps) => (
  <div className='flex min-h-48 items-center justify-center gap-2 text-muted-foreground'>
    <Loader2 className='size-5 animate-spin' />
    {message}
  </div>
);

interface EmptyMessageProps {
  message: string;
}

const EmptyMessage = ({ message }: EmptyMessageProps) => (
  <div className='flex min-h-48 items-center justify-center text-muted-foreground'>
    {message}
  </div>
);

export default Substations;
