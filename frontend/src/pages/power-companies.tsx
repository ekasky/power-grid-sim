import {
  deletePowerCompany,
  getPowerCompanies,
  type PowerCompany,
} from '@/api/power-companies';
import { DeleteActionDialog } from '@/components/delete-action-dialog';
import { EditPowerCompanyDialog } from '@/components/edit-power-company-dialog';
import { EntityTableCard } from '@/components/entity-table-card';
import { SortableHeader } from '@/components/sortable-header';
import { useEntityList } from '@/hooks/use-entity-list';
import { currencyFormatter, rateFormatter } from '@/lib/formatters';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const PowerCompanies = () => {
  const companies = useEntityList<PowerCompany>({
    queryKey: 'all',
    loadItems: getPowerCompanies,
    deleteItem: deletePowerCompany,
    loadErrorFallback: 'Unable tp load power companies',
    deleteErrorFallback: 'Unable to delete the power company',
  });

  const columns = useMemo<ColumnDef<PowerCompany>[]>(
    () => [
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
        header: ({ column }) => (
          <SortableHeader column={column} title='Costs' />
        ),
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
          const isDeleting = companies.deletingId === company.id;

          return (
            <div className='flex justify-end gap-2'>
              <EditPowerCompanyDialog
                company={company}
                onUpdated={companies.updateItem}
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
                onConfirm={() => companies.removeItem(company)}
              />
            </div>
          );
        },
      },
    ],
    [companies.deletingId, companies.removeItem, companies.updateItem],
  );

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Power Companies</h1>
        <p className='mt-1 text-muted-foreground'>
          View and sort all power companies in the simulation
        </p>
      </div>

      <EntityTableCard
        title='All Power Companies'
        description={`${companies.items.length}} ${companies.items.length === 1 ? 'company' : 'companies'} in the simulation.`}
        createLabel='Create Power Company'
        createTo='/create-power-company'
        data={companies.items}
        columns={columns}
        isLoading={companies.isLoading}
        loadingMessage='Loading power companies...'
        loadError={companies.loadError}
        loadingErrorTitle='Unable to load power companies'
        deleteError={companies.deleteError}
        deleteErrorTitle='Unable to delete power company'
        emptyMessage='No power companies have been created.'
      />
    </div>
  );
};

export default PowerCompanies;
