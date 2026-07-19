import { getPowerCompanies, type PowerCompany } from '@/api/power-companies';
import {
  deletePowerPlant,
  getPowerPlants,
  type PowerPlant,
} from '@/api/power-plants';
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
import { currencyFormatter, energyFormatter } from '@/lib/formatters';
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

const PowerPlants = () => {
  const [powerCompanies, setPowerCompanies] = useState<PowerCompany[]>([]);
  const [powerPlants, setPowerPlants] = useState<PowerPlant[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>('');

  const [sorting, setSorting] = useState<SortingState>([]);

  const [isLoadingCompanies, setIsLoadingCompanies] = useState<boolean>(true);
  const [isLoadingPlants, setIsLoadingPlants] = useState<boolean>(false);

  const [companyError, setCompanyError] = useState<string | null>(null);
  const [plantError, setPlantError] = useState<string | null>(null);

  const [deletingPlantId, setDeletingPlantId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const columns: ColumnDef<PowerPlant>[] = [
    {
      accessorKey: 'plantId',
      header: ({ column }) => (
        <SortableHeader column={column} title='Plant ID' />
      ),
      cell: ({ row }) => (
        <span className='font-medium'>{row.original.plantId}</span>
      ),
    },
    {
      id: 'initialBuildCost',
      accessorFn: (plant) => Number(plant.initialBuildCost),
      header: ({ column }) => (
        <SortableHeader column={column} title='Initial Build Cost' />
      ),
      cell: ({ row }) =>
        currencyFormatter.format(Number(row.original.initialBuildCost)),
    },
    {
      id: 'recurringGenerationCost',
      accessorFn: (plant) => Number(plant.recurringGenerationCost),
      header: ({ column }) => (
        <SortableHeader column={column} title='Generation Cost' />
      ),
      cell: ({ row }) =>
        currencyFormatter.format(Number(row.original.recurringGenerationCost)),
    },
    {
      id: 'powerProduced',
      accessorFn: (plant) => Number(plant.powerProduced),
      header: ({ column }) => (
        <SortableHeader column={column} title='Power Produced' />
      ),
      cell: ({ row }) => (
        <span>
          {energyFormatter.format(Number(row.original.powerProduced))} kWh
        </span>
      ),
    },
    {
      id: 'actions',
      enableSorting: false,
      header: () => <div className='text-right'>Actions</div>,
      cell: ({ row }) => {
        const plant = row.original;
        const isDeleting = deletingPlantId === plant.id;

        return (
          <div className='flex justify-end'>
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
                  <AlertDialogTitle>Delete {plant.plantId}?</AlertDialogTitle>

                  <AlertDialogDescription>
                    This action cannot be undone. The power plant will be
                    permanently removed from {selectedCompany?.longName}.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    variant='destructive'
                    disabled={isDeleting}
                    onClick={() => void handleDeletePowerPlant(plant)}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Power Plant'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  /* Load all power companies when the page opens */
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

        if (companies.length > 0) {
          setSelectedCompanyId(
            (currCompanyId) => currCompanyId || companies[0].id,
          );
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);

        if (!controller.signal.aborted) {
          setCompanyError(
            error instanceof Error
              ? error.message
              : 'Unable to load power companies',
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

  /* Load plants whenever the selected company changes */
  useEffect(() => {
    if (!selectedCompanyId) {
      setPowerPlants([]);
      return;
    }

    const controller = new AbortController();

    const loadPowerPlants = async () => {
      try {
        setIsLoadingPlants(true);
        setPlantError(null);

        const plants = await getPowerPlants(
          selectedCompanyId,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setPowerPlants(plants);
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);

        if (!controller.signal.aborted) {
          setPowerPlants([]);

          setPlantError(
            error instanceof Error
              ? error.message
              : 'Unable to load power plants',
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

  const selectedCompany = powerCompanies.find(
    (company) => company.id === selectedCompanyId,
  );

  const handleDeletePowerPlant = async (plant: PowerPlant) => {
    if (!selectedCompanyId) {
      setDeleteError('Select a power company before deleting a plant.');
      return;
    }

    try {
      setDeletingPlantId(plant.id);
      setDeleteError(null);

      await deletePowerPlant(plant.id);

      setPowerPlants((currentPlants) =>
        currentPlants.filter((currentPlant) => currentPlant.id !== plant.id),
      );
    } catch (error: unknown) {
      console.error(error);

      setDeleteError(
        error instanceof Error
          ? error.message
          : 'Unable to delete the power plant.',
      );
    } finally {
      setDeletingPlantId(null);
    }
  };

  const table = useReactTable({
    data: powerPlants,
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

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Power Plants</h1>
        <p className='mt-1 text-muted-foreground'>
          View power plants belonging to each company
        </p>
      </div>

      <Card>
        <CardHeader className='gap-4'>
          <div className='flex w-full items-center justify-between gap-4'>
            <div>
              <CardTitle>Power Plants</CardTitle>

              <CardDescription>
                {selectedCompany
                  ? `${powerPlants.length} ${
                      powerPlants.length === 1 ? 'plant' : 'plants'
                    } owned by ${selectedCompany.longName}.`
                  : 'Select a power company to view its plants.'}
              </CardDescription>
            </div>

            <Button
              render={<Link to='/create-power-plant'>Create Power Plant</Link>}
            />
          </div>

          <Select
            items={companyOptions}
            value={selectedCompanyId}
            onValueChange={(value) => {
              setSelectedCompanyId(value);
            }}
            disabled={isLoadingCompanies || powerCompanies.length === 0}
          >
            <SelectTrigger className='w-full sm:w-72'>
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
        </CardHeader>

        <CardContent>
          {deleteError && (
            <Alert variant='destructive' className='mb-4'>
              <AlertTitle>Unable to delete power plant</AlertTitle>
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

          {isLoadingCompanies ? (
            <div className='flex min-h-48 items-center justify-center gap-2 text-muted-foreground'>
              <Loader2 className='size-5 animate-spin' />
              Loading power companies...
            </div>
          ) : powerCompanies.length === 0 ? (
            <div className='flex min-h-48 items-center justify-center text-muted-foreground'>
              Create a power company before adding power plants.
            </div>
          ) : isLoadingPlants ? (
            <div className='flex min-h-48 items-center justify-center gap-2 text-muted-foreground'>
              <Loader2 className='size-5 animate-spin' />
              Loading power plants...
            </div>
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
                        {selectedCompany
                          ? `${selectedCompany.longName} does not have any power plants.`
                          : 'Select a power company.'}
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

export default PowerPlants;
