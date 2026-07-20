import {
  deletePowerSubstation,
  getPowerSubstations,
  type PowerSubstation,
} from '@/api/power-substations';
import { DeleteActionDialog } from '@/components/delete-action-dialog';
import { EditPowerSubstationDialog } from '@/components/edit-power-substation-dialog';
import { EntityTableCard } from '@/components/entity-table-card';
import { SortableHeader } from '@/components/sortable-header';
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
import { currencyFormatter } from '@/lib/formatters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';

const Substations = () => {
  const powerCompaniesState = usePowerCompanies();

  const powerPlantsState = usePowerPlants(
    powerCompaniesState.selectedPowerCompanyId,
  );

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

  const loadSubstations = useCallback(
    (signal: AbortSignal): Promise<PowerSubstation[]> => {
      if (!selectedPowerPlantId) {
        return Promise.resolve([]);
      }

      return getPowerSubstations(selectedPowerPlantId, signal);
    },
    [selectedPowerPlantId],
  );

  const substations = useEntityList<PowerSubstation>({
    queryKey: selectedPowerPlantId,
    loadItems: loadSubstations,
    deleteItem: deletePowerSubstation,
    loadErrorFallback: 'Unable to load substations',
    deleteErrorFallback: 'Unable to delete substation',
  });

  const selectedCompany =
    powerCompanies.find((company) => company.id === selectedPowerCompanyId) ??
    null;

  const selectedPlant =
    powerPlants.find((plant) => plant.id === selectedPowerPlantId) ?? null;

  const columns = useMemo<ColumnDef<PowerSubstation>[]>(
    () => [
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
        accessorFn: (substation) => Number(substation.initialBuildCost),
        header: ({ column }) => (
          <SortableHeader column={column} title='Installation Cost' />
        ),
        cell: ({ row }) =>
          currencyFormatter.format(Number(row.original.initialBuildCost)),
      },
      {
        id: 'recurringMaintenanceCost',
        accessorFn: (substation) => Number(substation.recurringMaintenanceCost),
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
          const isDeleting = substations.deletingId === substation.id;

          return (
            <div className='flex justify-end gap-2'>
              <EditPowerSubstationDialog
                substation={substation}
                disabled={isDeleting}
                onUpdated={substations.updateItem}
              />

              <DeleteActionDialog
                title={`Delete ${substation.substationId}?`}
                description={
                  <>
                    This action cannot be undone. The substation will be
                    permanently removed from{' '}
                    {selectedPlant?.plantId ?? 'the power plant'}.
                  </>
                }
                confirmLabel='Delete Substation'
                isDeleting={isDeleting}
                onConfirm={() => substations.removeItem(substation)}
              />
            </div>
          );
        },
      },
    ],
    [
      selectedPlant?.plantId,
      substations.deletingId,
      substations.removeItem,
      substations.updateItem,
    ],
  );

  const isLoading =
    isLoadingPowerCompanies || isLoadingPowerPlants || substations.isLoading;

  const loadingMessage = isLoadingPowerCompanies
    ? 'Loading power companies...'
    : isLoadingPowerPlants
      ? 'Loading power plants...'
      : 'Loading power substations...';

  const loadError =
    powerCompanyError ?? powerPlantError ?? substations.loadError;

  const loadErrorTitle = powerCompanyError
    ? 'Unable to load power companies'
    : powerPlantError
      ? 'Unable to load power plants'
      : 'Unable to load power substations';

  const description = selectedPlant
    ? `${substations.items.length} ${
        substations.items.length === 1 ? 'substation' : 'substations'
      } assigned to ${selectedPlant.plantId}.`
    : 'Select a power plant to view its substations.';

  const emptyMessage =
    powerCompanies.length === 0
      ? 'Create a power company before adding substations.'
      : powerPlants.length === 0
        ? `${
            selectedCompany?.longName ?? 'This company'
          } does not have any power plants.`
        : selectedPlant
          ? `${selectedPlant.plantId} does not have any substations.`
          : 'Select a power plant.';

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Power Substations</h1>

        <p className='mt-1 text-muted-foreground'>
          View substations belonging to each power plant.
        </p>
      </div>

      <EntityTableCard<PowerSubstation>
        title='Power Substations'
        description={description}
        createLabel='Create Power Substation'
        createTo='/create-substation'
        data={substations.items}
        columns={columns}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        loadError={loadError}
        loadErrorTitle={loadErrorTitle}
        deleteError={substations.deleteError}
        deleteErrorTitle='Unable to delete power substation'
        emptyMessage={emptyMessage}
        toolbar={
          <div className='flex flex-col gap-3 sm:flex-row'>
            <Select
              items={companyOptions}
              value={selectedPowerCompanyId}
              onValueChange={selectPowerCompany}
              disabled={isLoadingPowerCompanies || powerCompanies.length === 0}
            >
              <SelectTrigger className='w-full sm:w-80'>
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
              <SelectTrigger className='w-full sm:w-72'>
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
        }
      />
    </div>
  );
};

export default Substations;
