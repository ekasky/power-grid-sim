import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { useSubstation } from '@/hooks/use-substation';

interface SelectSubstationProps extends Pick<
  ReturnType<typeof useSubstation>,
  | 'isLoadingSubstations'
  | 'selectSubstation'
  | 'selectedSubstationId'
  | 'substationError'
  | 'substationOptions'
  | 'substations'
> {
  isSubmitting: boolean;
}

export const SelectSubstation = ({
  isLoadingSubstations,
  selectSubstation,
  selectedSubstationId,
  substationError,
  substationOptions,
  substations,
  isSubmitting,
}: SelectSubstationProps) => {
  return (
    <div className='space-y-2'>
      <Label>Power Plants</Label>

      <Select
        items={substationOptions}
        value={selectedSubstationId}
        onValueChange={(value) => selectSubstation(value)}
        disabled={
          isLoadingSubstations || substations.length === 0 || isSubmitting
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
          {substations.map((sub) => (
            <SelectItem key={sub.id} value={sub.id}>
              {sub.substationId}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!isLoadingSubstations &&
        !substationError &&
        substations.length === 0 && (
          <p className='text-sm text-muted-foreground'>
            No substations are available.
          </p>
        )}
    </div>
  );
};
