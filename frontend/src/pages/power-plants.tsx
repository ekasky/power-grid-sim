import {
  deletePowerPlant,
  getPowerPlants,
  type PowerPlant,
} from '@/api/power-plants';
import { DeleteActionDialog } from '@/components/delete-action-dialog';
import { EditPowerPlantDialog } from '@/components/edit-power-plant-dialog';
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
import { currencyFormatter, energyFormatter } from '@/lib/formatters';
import { type ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';

const PowerPlants = () => {
  const {
    powerCompanies,
    selectedPowerCompanyId,
    isLoadingPowerCompanies,
    powerCompanyError,
    selectPowerCompany,
    companyOptions,
  } = usePowerCompanies();

  const loadPlants = useCallback(
    (signal: AbortSignal) =>
      selectedPowerCompanyId
        ? getPowerPlants(selectedPowerCompanyId, signal)
        : Promise.resolve<PowerPlant[]>([]),
    [selectedPowerCompanyId],
  );

  const plants = useEntityList<PowerPlant>({
    queryKey: selectedPowerCompanyId,
    loadItems: loadPlants,
    deleteItem: deletePowerPlant,
    loadErrorFallback: 'Unable to load power plants',
    deleteErrorFallback: 'Unable to delete power plant',
  });

  const selectedCompany = powerCompanies.find(
    (company) => company.id === selectedPowerCompanyId,
  );

  const columns = useMemo<ColumnDef<PowerPlant>[]>(
    () => [
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
          currencyFormatter.format(
            Number(row.original.recurringGenerationCost),
          ),
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
        id: 'location',
        accessorFn: (plant) =>
          plant.location ? `${plant.location.x},${plant.location.y}` : '',
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
          const plant = row.original;
          const isDeleting = plants.deletingId === plant.id;

          return (
            <div className='flex justify-end'>
              <EditPowerPlantDialog
                plant={plant}
                disabled={isDeleting}
                onUpdated={plants.updateItem}
              />

              <DeleteActionDialog
                title={`Delete ${plant.plantId}?`}
                description={
                  <>
                    This action cannot be undone. The power plant will be
                    permanently removed from{' '}
                    {plant.plantId ?? 'the power plant'}.
                  </>
                }
                confirmLabel='Delete Power Plant'
                isDeleting={isDeleting}
                onConfirm={() => plants.removeItem(plant)}
              />
            </div>
          );
        },
      },
    ],
    [plants.deletingId, plants.removeItem, plants.updateItem],
  );

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Power Plants</h1>
        <p className='mt-1 text-muted-foreground'>
          View power plants belonging to each company
        </p>
      </div>

      <EntityTableCard<PowerPlant>
        title='Power Plants'
        description={
          selectedCompany
            ? `${plants.items.length} ${
                plants.items.length === 1 ? 'plant' : 'plants'
              } owned by ${selectedCompany.longName}.`
            : 'Select a power company to view its plants.'
        }
        createLabel='Create Power Plant'
        createTo='/create-power-plant'
        data={plants.items}
        columns={columns}
        isLoading={isLoadingPowerCompanies || plants.isLoading}
        loadingMessage={
          isLoadingPowerCompanies
            ? 'Loading power companies...'
            : 'Loading power plants...'
        }
        loadError={powerCompanyError ?? plants.loadError}
        loadErrorTitle={
          powerCompanyError
            ? 'Unable to load power companies'
            : 'Unable to load power plants'
        }
        deleteError={plants.deleteError}
        deleteErrorTitle='Unable to delete power plant'
        emptyMessage={
          powerCompanies.length === 0
            ? 'Create a power company before adding power plants.'
            : selectedCompany
              ? `${selectedCompany.longName} does not have any power plants.`
              : 'Select a power company.'
        }
        toolbar={
          <Select
            items={companyOptions}
            value={selectedPowerCompanyId}
            onValueChange={selectPowerCompany}
            disabled={isLoadingPowerCompanies || powerCompanies.length === 0}
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
        }
      />
    </div>
  );
};

export default PowerPlants;
