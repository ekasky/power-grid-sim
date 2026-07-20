import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { usePowerPlants } from '@/hooks/use-power-plants';

interface SelectPowerPlantsProps extends Pick<
  ReturnType<typeof usePowerPlants>,
  | 'isLoadingPowerPlants'
  | 'plantOptions'
  | 'powerPlantError'
  | 'powerPlants'
  | 'selectPowerPlant'
  | 'selectedPowerPlantId'
> {
  isSubmitting: boolean;
}

export const SelectPowerPlants = ({
  isLoadingPowerPlants,
  plantOptions,
  powerPlantError,
  powerPlants,
  selectPowerPlant,
  selectedPowerPlantId,
  isSubmitting,
}: SelectPowerPlantsProps) => {
  return (
    <div className='space-y-2'>
      <Label>Power Plants</Label>

      <Select
        items={plantOptions}
        value={selectedPowerPlantId}
        onValueChange={(value) => selectPowerPlant(value)}
        disabled={
          isLoadingPowerPlants || powerPlants.length === 0 || isSubmitting
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

      {!isLoadingPowerPlants &&
        !powerPlantError &&
        powerPlants.length === 0 && (
          <p className='text-sm text-muted-foreground'>
            No power plants are available.
          </p>
        )}
    </div>
  );
};
