import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { usePowerCompanies } from '@/hooks/use-power-companies';

interface SelectPowerCompanyProps extends Pick<
  ReturnType<typeof usePowerCompanies>,
  | 'companyOptions'
  | 'isLoadingPowerCompanies'
  | 'powerCompanies'
  | 'powerCompanyError'
  | 'selectPowerCompany'
  | 'selectedPowerCompanyId'
> {
  isSubmitting: boolean;
}

export const SelectPowerCompany = ({
  companyOptions,
  isLoadingPowerCompanies,
  powerCompanies,
  powerCompanyError,
  selectPowerCompany,
  selectedPowerCompanyId,
  isSubmitting,
}: SelectPowerCompanyProps) => {
  return (
    <div className='space-y-2'>
      <Label>Power Company</Label>

      <Select
        items={companyOptions}
        value={selectedPowerCompanyId}
        onValueChange={(value) => selectPowerCompany(value)}
        disabled={
          isLoadingPowerCompanies || powerCompanies.length === 0 || isSubmitting
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

      {!isLoadingPowerCompanies &&
        !powerCompanyError &&
        powerCompanies.length === 0 && (
          <p className='text-sm text-muted-foreground'>
            No power companies are available.
          </p>
        )}
    </div>
  );
};
