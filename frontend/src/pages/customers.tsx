import { deleteCustomer, getCustomers, type Customer } from '@/api/customer';
import { DeleteActionDialog } from '@/components/delete-action-dialog';
import { EditCustomerDialog } from '@/components/edit-customer-dialog';
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
import { currencyFormatter } from '@/lib/formatters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';

export const Customers = () => {
  const powerCompaniesState = usePowerCompanies();

  const {
    powerCompanies,
    selectedPowerCompanyId,
    isLoadingPowerCompanies,
    powerCompanyError,
    selectPowerCompany,
    companyOptions,
  } = powerCompaniesState;

  const loadCustomers = useCallback(
    (signal: AbortSignal): Promise<Customer[]> => {
      if (!selectedPowerCompanyId) {
        return Promise.resolve([]);
      }

      return getCustomers(selectedPowerCompanyId, signal);
    },
    [selectedPowerCompanyId],
  );

  const customers = useEntityList<Customer>({
    queryKey: selectedPowerCompanyId,
    loadItems: loadCustomers,
    deleteItem: deleteCustomer,
    loadErrorFallback: 'Unable to load customers',
    deleteErrorFallback: 'Unable to delete customer',
  });

  const selectedCompany =
    powerCompanies.find((company) => company.id === selectedPowerCompanyId) ??
    null;

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'accountNumber',
        header: ({ column }) => (
          <SortableHeader column={column} title='Account Number' />
        ),
        cell: ({ row }) => (
          <span className='font-medium'>{row.original.accountNumber}</span>
        ),
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <SortableHeader column={column} title='Customer Name' />
        ),
        cell: ({ row }) => <span>{row.original.name}</span>,
      },
      {
        accessorKey: 'customerType',
        header: ({ column }) => (
          <SortableHeader column={column} title='Customer Type' />
        ),
        cell: ({ row }) => (
          <span className='capitalize'>
            {row.original.customerType.toLowerCase()}
          </span>
        ),
      },
      {
        accessorKey: 'effectiveBillingRate',
        header: ({ column }) => (
          <SortableHeader column={column} title='Billing Rate' />
        ),
        cell: ({ row }) => {
          const rate = Number(row.original.effectiveBillingRate);

          return (
            <span>
              {Number.isFinite(rate)
                ? `${currencyFormatter.format(rate)} / kWh`
                : '—'}
            </span>
          );
        },
      },
      {
        id: 'location',
        accessorFn: (customer) =>
          customer.location
            ? `${customer.location.x},${customer.location.y}`
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
          const customer = row.original;
          const isDeleting = customers.deletingId === customer.id;

          return (
            <div className='flex justify-end gap-2'>
              <EditCustomerDialog
                customer={customer}
                disabled={isDeleting}
                onUpdated={customers.updateItem}
              />

              <DeleteActionDialog
                title={`Delete ${customer.accountNumber}?`}
                description={
                  <>
                    This action cannot be undone. Customer{' '}
                    <strong>{customer.name}</strong> with account number{' '}
                    <strong>{customer.accountNumber}</strong> will be
                    permanently removed from{' '}
                    <strong>
                      {selectedCompany?.longName ?? 'the power company'}
                    </strong>
                    .
                  </>
                }
                confirmLabel='Delete Customer'
                isDeleting={isDeleting}
                onConfirm={() => customers.removeItem(customer)}
              />
            </div>
          );
        },
      },
    ],
    [
      selectedCompany?.longName,
      customers.deletingId,
      customers.removeItem,
      customers.updateItem,
    ],
  );

  const isLoading = isLoadingPowerCompanies || customers.isLoading;

  const loadingMessage = isLoadingPowerCompanies
    ? 'Loading power companies...'
    : 'Loading customers...';

  const loadError = powerCompanyError ?? customers.loadError;

  const loadErrorTitle = powerCompanyError
    ? 'Unable to load power companies'
    : 'Unable to load customers';

  const description = selectedCompany
    ? `${customers.items.length} ${
        customers.items.length === 1 ? 'customer' : 'customers'
      } belonging to ${selectedCompany.longName}.`
    : 'Select a power company to view its customers.';

  const emptyMessage =
    powerCompanies.length === 0
      ? 'Create a power company before adding customers.'
      : selectedCompany
        ? `${selectedCompany.longName} does not have any customers.`
        : 'Select a power company.';

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Customers</h1>

        <p className='mt-1 text-muted-foreground'>
          View customers belonging to each power company.
        </p>
      </div>

      <EntityTableCard<Customer>
        title='Customers'
        description={description}
        createLabel='Create Customer'
        createTo='/create-customer'
        data={customers.items}
        columns={columns}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        loadError={loadError}
        loadErrorTitle={loadErrorTitle}
        deleteError={customers.deleteError}
        deleteErrorTitle='Unable to delete customer'
        emptyMessage={emptyMessage}
        toolbar={
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
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
          </div>
        }
      />
    </div>
  );
};
