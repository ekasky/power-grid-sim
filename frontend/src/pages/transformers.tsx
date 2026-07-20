import {
  deleteTransformer,
  getTransformers,
  type Transformer,
} from '@/api/transformers';
import { DeleteActionDialog } from '@/components/delete-action-dialog';
import { EditTransformerDialog } from '@/components/edit-transformer-dialog';
import { EntityTableCard } from '@/components/entity-table-card';
import { SortableHeader } from '@/components/sortable-header';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEntityList } from '@/hooks/use-entity-list';
import { usePowerCompanies } from '@/hooks/use-power-companies';
import { usePowerPlants } from '@/hooks/use-power-plants';
import { useSubstation } from '@/hooks/use-substation';

import { currencyFormatter } from '@/lib/formatters';
import { type ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';

const Transformers = () => {
  const powerCompaniesState = usePowerCompanies();

  const powerPlantsState = usePowerPlants(
    powerCompaniesState.selectedPowerCompanyId,
  );

  const substationsState = useSubstation(powerPlantsState.selectedPowerPlantId);

  const {
    powerCompanies,
    selectedPowerCompanyId,
    isLoadingPowerCompanies,
    powerCompanyError,
    selectPowerCompany,
    companyOptions,
  } = powerCompaniesState;

  const {
    powerPlants,
    selectedPowerPlantId,
    isLoadingPowerPlants,
    powerPlantError,
    selectPowerPlant,
    plantOptions,
  } = powerPlantsState;

  const {
    substations,
    selectedSubstationId,
    isLoadingSubstations,
    substationError,
    selectSubstation,
    substationOptions,
  } = substationsState;

  const loadTransformers = useCallback(
    (signal: AbortSignal): Promise<Transformer[]> => {
      if (!selectedSubstationId) {
        return Promise.resolve([]);
      }

      return getTransformers(selectedSubstationId, signal);
    },
    [selectedSubstationId],
  );

  const transformers = useEntityList<Transformer>({
    queryKey: selectedSubstationId,
    loadItems: loadTransformers,
    deleteItem: deleteTransformer,
    loadErrorFallback: 'Unable to load transformers',
    deleteErrorFallback: 'Unable to delete transformer',
  });

  const selectedCompany =
    powerCompanies.find((company) => company.id === selectedPowerCompanyId) ??
    null;

  const selectedPlant =
    powerPlants.find((plant) => plant.id === selectedPowerPlantId) ?? null;

  const selectedSubstation =
    substations.find((substation) => substation.id === selectedSubstationId) ??
    null;

  const columns = useMemo<ColumnDef<Transformer>[]>(
    () => [
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
        accessorFn: (transformer) =>
          Number(transformer.initialInstallationCost),
        header: ({ column }) => (
          <SortableHeader column={column} title='Installation Cost' />
        ),
        cell: ({ row }) =>
          currencyFormatter.format(
            Number(row.original.initialInstallationCost),
          ),
      },
      {
        id: 'maintenanceCost',
        accessorFn: (transformer) =>
          Number(transformer.recurringMaintenanceCost),
        header: ({ column }) => (
          <SortableHeader column={column} title='Maintenance Cost' />
        ),
        cell: ({ row }) =>
          currencyFormatter.format(
            Number(row.original.recurringMaintenanceCost),
          ),
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
          const isDeleting = transformers.deletingId === transformer.id;

          return (
            <div className='flex justify-end gap-2'>
              <EditTransformerDialog
                transformer={transformer}
                disabled={isDeleting}
                onUpdated={transformers.updateItem}
              />

              <DeleteActionDialog
                title={`Delete ${transformer.transformerId}?`}
                description={
                  <>
                    This action cannot be undone. The transformer will be
                    permanently removed from{' '}
                    {selectedSubstation?.substationId ?? 'the power substation'}
                    .
                  </>
                }
                confirmLabel='Delete Transformer'
                isDeleting={isDeleting}
                onConfirm={() => transformers.removeItem(transformer)}
              />
            </div>
          );
        },
      },
    ],
    [
      selectedSubstation?.substationId,
      transformers.deletingId,
      transformers.removeItem,
      transformers.updateItem,
    ],
  );

  const isLoading =
    isLoadingPowerCompanies ||
    isLoadingPowerPlants ||
    isLoadingSubstations ||
    transformers.isLoading;

  const loadingMessage = isLoadingPowerCompanies
    ? 'Loading power companies...'
    : isLoadingPowerPlants
      ? 'Loading power plants...'
      : isLoadingSubstations
        ? 'Loading power substations...'
        : 'Loading transformers...';

  const loadError =
    powerCompanyError ??
    powerPlantError ??
    substationError ??
    transformers.loadError;

  const loadErrorTitle = powerCompanyError
    ? 'Unable to load power companies'
    : powerPlantError
      ? 'Unable to load power plants'
      : substationError
        ? 'Unable to load power substations'
        : 'Unable to load transformers';

  const description = selectedSubstation
    ? `${transformers.items.length} ${
        transformers.items.length === 1 ? 'transformer' : 'transformers'
      } assigned to ${selectedSubstation.substationId}.`
    : 'Select a power substation to view its transformers.';

  const emptyMessage =
    powerCompanies.length === 0
      ? 'Create a power company before adding transformers.'
      : powerPlants.length === 0
        ? `${
            selectedCompany?.longName ?? 'This company'
          } does not have any power plants.`
        : substations.length === 0
          ? `${
              selectedPlant?.plantId ?? 'This power plant'
            } does not have any substations.`
          : selectedSubstation
            ? `${selectedSubstation.substationId} does not have any transformers.`
            : 'Select a power substation.';

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Transformers</h1>

        <p className='mt-1 text-muted-foreground'>
          View transformers belonging to each power substation
        </p>
      </div>

      <EntityTableCard<Transformer>
        title='Transformers'
        description={description}
        createLabel='Create Transformer'
        createTo='/create-transformer'
        data={transformers.items}
        columns={columns}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        loadError={loadError}
        loadErrorTitle={loadErrorTitle}
        deleteError={transformers.deleteError}
        deleteErrorTitle='Unable to delete transformer'
        emptyMessage={emptyMessage}
        toolbar={
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <div className='space-y-2'>
              <Label>Power Company</Label>

              <Select
                items={companyOptions}
                value={selectedPowerCompanyId}
                onValueChange={selectPowerCompany}
                disabled={
                  isLoadingPowerCompanies || powerCompanies.length === 0
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue
                    placeholder={
                      isLoadingPowerCompanies
                        ? 'Loading power companies...'
                        : 'Select a power company'
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {powerCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.longName} ({company.shortName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Power Plant</Label>

              <Select
                items={plantOptions}
                value={selectedPowerPlantId}
                onValueChange={selectPowerPlant}
                disabled={
                  isLoadingPowerPlants ||
                  !selectedPowerCompanyId ||
                  powerPlants.length === 0
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue
                    placeholder={
                      isLoadingPowerPlants
                        ? 'Loading power plants...'
                        : 'Select a power plant'
                    }
                  />
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

            <div className='space-y-2 md:col-span-2 lg:col-span-1'>
              <Label>Power Substation</Label>

              <Select
                items={substationOptions}
                value={selectedSubstationId}
                onValueChange={selectSubstation}
                disabled={
                  isLoadingSubstations ||
                  !selectedPowerPlantId ||
                  substations.length === 0
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue
                    placeholder={
                      isLoadingSubstations
                        ? 'Loading substations...'
                        : 'Select a substation'
                    }
                  />
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
          </div>
        }
      />
    </div>
  );
};

export default Transformers;
