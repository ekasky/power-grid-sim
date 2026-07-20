import { getPowerPlants, type PowerPlant } from '@/api/power-plants';
import { useEffect, useState } from 'react';

interface PowerPlantState {
  powerCompanyId: string | null;
  powerPlants: PowerPlant[];
  selectedPowerPlantId: string | null;
  powerPlantError: string | null;
}

export const usePowerPlants = (powerCompanyId: string | null) => {
  const [state, setState] = useState<PowerPlantState>({
    powerCompanyId: null,
    powerPlants: [],
    selectedPowerPlantId: null,
    powerPlantError: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadPowerPlants = async () => {
      try {
        if (!powerCompanyId) {
          return;
        }

        const plants = await getPowerPlants(powerCompanyId, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setState({
          powerCompanyId,
          powerPlants: plants,
          selectedPowerPlantId: plants[0]?.id ?? null,
          powerPlantError: null,
        });
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);

        if (!controller.signal.aborted) {
          setState({
            powerCompanyId,
            powerPlants: [],
            selectedPowerPlantId: null,
            powerPlantError:
              error instanceof Error
                ? error.message
                : 'Unable to load power plants',
          });
        }
      }
    };

    void loadPowerPlants();

    return () => {
      controller.abort();
    };
  }, [powerCompanyId]);

  /*
   * Hide data belonging to the previously selected company.
   */
  const hasCurrentCompanyData = state.powerCompanyId === powerCompanyId;

  const powerPlants =
    powerCompanyId && hasCurrentCompanyData ? state.powerPlants : [];
  const selectedPowerPlantId = hasCurrentCompanyData
    ? state.selectedPowerPlantId
    : null;
  const powerPlantError = hasCurrentCompanyData ? state.powerPlantError : null;

  const selectPowerPlant = (plantId: string | null) => {
    setState((curr) => ({
      ...curr,
      selectedPowerPlantId: plantId,
    }));
  };

  const isLoadingPowerPlants =
    powerCompanyId !== null && !hasCurrentCompanyData;

  const plantOptions = powerPlants.map((plant) => ({
    value: plant.id,
    label: `${plant.plantId}`,
  }));

  return {
    powerPlants,
    selectedPowerPlantId,
    isLoadingPowerPlants,
    powerPlantError,
    selectPowerPlant,
    plantOptions,
  };
};
