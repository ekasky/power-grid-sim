import { getPowerCompanies, type PowerCompany } from '@/api/power-companies';
import { getPowerPlants, type PowerPlant } from '@/api/power-plants';
import {
  getPowerSubstations,
  type PowerSubstation,
} from '@/api/power-substations';
import {
  deleteTransformer,
  getTransformers,
  type Transformer,
} from '@/api/transformers';
import { DeleteActionDialog } from '@/components/delete-action-dialog';
import { EditTransformerDialog } from '@/components/edit-transformer-dialog';
import { EmptyMessage } from '@/components/empty-message';
import { LoadingMessage } from '@/components/loading-message';
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
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Transformers = () => {
  const [powerCompanies, setPowerCompanies] = useState<PowerCompany[]>([]);
  const [powerPlants, setPowerPlants] = useState<PowerPlant[]>([]);
  const [substations, setSubstations] = useState<PowerSubstation[]>([]);
  const [transformers, setTransformers] = useState<Transformer[]>([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [selectedSubstationId, setSelectedSubstationId] = useState<
    string | null
  >(null);

  const [sorting, setSorting] = useState<SortingState>([]);

  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [isLoadingPlants, setIsLoadingPlants] = useState(false);
  const [isLoadingSubstations, setIsLoadingSubstations] = useState(false);
  const [isLoadingTransformers, setIsLoadingTransformers] = useState(false);

  const [companyError, setCompanyError] = useState<string | null>(null);
  const [plantError, setPlantError] = useState<string | null>(null);
  const [substationError, setSubstationError] = useState<string | null>(null);
  const [transformerError, setTransformerError] = useState<string | null>(null);

  const [deletingTransformerId, setDeletingTransformerId] = useState<
    string | null
  >(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const selectedCompany = powerCompanies.find(
    (company) => company.id === selectedCompanyId,
  );

  const selectedPlant = powerPlants.find(
    (plant) => plant.id === selectedPlantId,
  );

  const selectedSubstation = substations.find(
    (substation) => substation.id === selectedSubstationId,
  );

  const handleDeleteTransformer = async (transformer: Transformer) => {
    try {
      setDeletingTransformerId(transformer.id);
      setDeleteError(null);

      await deleteTransformer(transformer.id);

      setTransformers((currentTransformers) =>
        currentTransformers.filter(
          (currentTransformer) => currentTransformer.id !== transformer.id,
        ),
      );
    } catch (error: unknown) {
      console.error(error);

      setDeleteError(
        error instanceof Error
          ? error.message
          : 'Unable to delete the transformer.',
      );
    } finally {
      setDeletingTransformerId(null);
    }
  };

  const handleTransformerUpdated = (updatedTransformer: Transformer) => {
    setTransformers((currentTransformers) =>
      currentTransformers.map((transformer) =>
        transformer.id === updatedTransformer.id
          ? updatedTransformer
          : transformer,
      ),
    );
  };

  const columns: ColumnDef<Transformer>[] = [
    {
      accessorKey: 'transformerId',
      header: ({ column }) => (
        <SortableHeader column={column} title='Transformer ID' />
      ),
      cell: ({ row }) => (
        <span className='font-medium'>{row.original.transformerId}</span>
      ),
    },
    {
      id: 'installCost',
      accessorFn: (transformer) => Number(transformer.initialInstallationCost),
      header: ({ column }) => (
        <SortableHeader column={column} title='Installation Cost' />
      ),
      cell: ({ row }) =>
        currencyFormatter.format(Number(row.original.initialInstallationCost)),
    },
    {
      id: 'maintenanceCost',
      accessorFn: (transformer) => Number(transformer.recurringMaintenanceCost),
      header: ({ column }) => (
        <SortableHeader column={column} title='Maintenance Cost' />
      ),
      cell: ({ row }) =>
        currencyFormatter.format(Number(row.original.recurringMaintenanceCost)),
    },
    {
      id: 'location',
      accessorFn: (transformer) =>
        transformer.location
          ? `${transformer.location.x},${transformer.location.y}`
          : '',
      header: ({ column }) => (
        <SortableHeader column={column} title='Location' />
      ),
      cell: ({ row }) =>
        row.original.location
          ? `(${row.original.location.x}, ${row.original.location.y})`
          : '--',
    },
    {
      id: 'actions',
      enableSorting: false,
      header: () => <div className='text-right'>Actions</div>,
      cell: ({ row }) => {
        const transformer = row.original;
        const isDeleting = deletingTransformerId === transformer.id;

        return (
          <div className='flex justify-end gap-2'>
            <EditTransformerDialog
              transformer={transformer}
              disabled={isDeleting}
              onUpdated={handleTransformerUpdated}
            />

            <DeleteActionDialog
              title={`Delete ${transformer.transformerId}?`}
              description={
                <>
                  This action cannot be undone. The transformer will be
                  permanently removed from{' '}
                  {selectedSubstation?.substationId ?? 'the power substation'}.
                </>
              }
              confirmLabel='Delete Transformer'
              isDeleting={isDeleting}
              onConfirm={() => handleDeleteTransformer(transformer)}
            />
          </div>
        );
      },
    },
  ];

  /*
   * Load power companies.
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
    setSelectedSubstationId(null);
    setPowerPlants([]);
    setSubstations([]);
    setTransformers([]);
    setPlantError(null);
    setSubstationError(null);
    setTransformerError(null);
    setDeleteError(null);

    if (!selectedCompanyId) {
      setIsLoadingPlants(false);
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
    setSelectedSubstationId(null);
    setSubstations([]);
    setTransformers([]);
    setSubstationError(null);
    setTransformerError(null);
    setDeleteError(null);

    if (!selectedPlantId) {
      setIsLoadingSubstations(false);
      return;
    }

    const controller = new AbortController();

    const loadPowerSubstations = async () => {
      try {
        setIsLoadingSubstations(true);

        const loadedSubstations = await getPowerSubstations(
          selectedPlantId,
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        setSubstations(loadedSubstations);
        setSelectedSubstationId(loadedSubstations[0]?.id ?? null);
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

    void loadPowerSubstations();

    return () => {
      controller.abort();
    };
  }, [selectedPlantId]);

  /*
   * Load the selected substation's transformers.
   */
  useEffect(() => {
    setTransformers([]);
    setTransformerError(null);
    setDeleteError(null);

    if (!selectedSubstationId) {
      setIsLoadingTransformers(false);
      return;
    }

    const controller = new AbortController();

    const loadTransformers = async () => {
      try {
        setIsLoadingTransformers(true);

        const loadedTransformers = await getTransformers(
          selectedSubstationId,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setTransformers(loadedTransformers);
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);

        if (!controller.signal.aborted) {
          setTransformerError(
            error instanceof Error
              ? error.message
              : 'Unable to load transformers.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingTransformers(false);
        }
      }
    };

    void loadTransformers();

    return () => {
      controller.abort();
    };
  }, [selectedSubstationId]);

  const table = useReactTable({
    data: transformers,
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

  const substationOptions = substations.map((substation) => ({
    value: substation.id,
    label: substation.substationId,
  }));

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Transformers</h1>

        <p className='mt-1 text-muted-foreground'>
          View transformers belonging to each power substation
        </p>
      </div>

      <Card>
        <CardHeader className='gap-4'>
          <div className='flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <CardTitle>Transformers</CardTitle>

              <CardDescription>
                {selectedSubstation
                  ? `${transformers.length} ${
                      transformers.length === 1 ? 'transformer' : 'transformers'
                    } assigned to ${selectedSubstation.substationId}.`
                  : 'Select a power substation to view its transformers.'}
              </CardDescription>
            </div>

            {selectedSubstationId ? (
              <Button
                render={
                  <Link to={`/create-transformer`}>Create Transformer</Link>
                }
              />
            ) : (
              <Button disabled>Create Transformer</Button>
            )}
          </div>

          <div className='flex flex-col gap-3 lg:flex-row'>
            <Select
              items={companyOptions}
              value={selectedCompanyId}
              onValueChange={setSelectedCompanyId}
              disabled={isLoadingCompanies || powerCompanies.length === 0}
            >
              <SelectTrigger className='w-full lg:w-80'>
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
              onValueChange={setSelectedPlantId}
              disabled={
                isLoadingPlants ||
                !selectedCompanyId ||
                powerPlants.length === 0
              }
            >
              <SelectTrigger className='w-full lg:w-64'>
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

            <Select
              items={substationOptions}
              value={selectedSubstationId}
              onValueChange={setSelectedSubstationId}
              disabled={
                isLoadingSubstations ||
                !selectedPlantId ||
                substations.length === 0
              }
            >
              <SelectTrigger className='w-full lg:w-64'>
                <SelectValue placeholder='Select a substation' />
              </SelectTrigger>

              <SelectContent>
                {substations.map((substation) => (
                  <SelectItem key={substation.id} value={substation.id}>
                    {substation.substationId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {deleteError && (
            <Alert variant='destructive' className='mb-4'>
              <AlertTitle>Unable to delete transformer</AlertTitle>
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

          {transformerError && (
            <Alert variant='destructive' className='mb-4'>
              <AlertTitle>Unable to load transformers</AlertTitle>
              <AlertDescription>{transformerError}</AlertDescription>
            </Alert>
          )}

          {isLoadingCompanies ? (
            <LoadingMessage message='Loading power companies...' />
          ) : companyError ? null : powerCompanies.length === 0 ? (
            <EmptyMessage message='Create a power company before adding transformers.' />
          ) : isLoadingPlants ? (
            <LoadingMessage message='Loading power plants...' />
          ) : plantError ? null : powerPlants.length === 0 ? (
            <EmptyMessage
              message={`${selectedCompany?.longName ?? 'This company'} does not have any power plants.`}
            />
          ) : isLoadingSubstations ? (
            <LoadingMessage message='Loading power substations...' />
          ) : substationError ? null : substations.length === 0 ? (
            <EmptyMessage
              message={`${selectedPlant?.plantId ?? 'This power plant'} does not have any substations.`}
            />
          ) : isLoadingTransformers ? (
            <LoadingMessage message='Loading transformers...' />
          ) : transformerError ? null : transformers.length === 0 ? (
            <EmptyMessage
              message={`${selectedSubstation?.substationId ?? 'This substation'} does not have any transformers.`}
            />
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
    </div>
  );
};

export default Transformers;
