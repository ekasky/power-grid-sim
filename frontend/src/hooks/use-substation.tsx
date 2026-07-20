import {
  getPowerSubstations,
  type PowerSubstation,
} from '@/api/power-substations';
import { useEffect, useState } from 'react';

interface SubstationState {
  powerPlantId: string | null;
  substations: PowerSubstation[];
  selectedSubstationId: string | null;
  substationError: string | null;
}

export const useSubstation = (powerPlantId: string | null) => {
  const [state, setState] = useState<SubstationState>({
    powerPlantId,
    substations: [],
    selectedSubstationId: null,
    substationError: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadSubstation = async () => {
      try {
        if (!powerPlantId) {
          return;
        }

        const substations = await getPowerSubstations(
          powerPlantId,
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        setState({
          powerPlantId,
          substations,
          selectedSubstationId: substations[0]?.id ?? null,
          substationError: null,
        });
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);

        if (!controller.signal.aborted) {
          setState({
            powerPlantId,
            substations: [],
            selectedSubstationId: null,
            substationError:
              error instanceof Error
                ? error.message
                : 'Unable to load substations',
          });
        }
      }
    };

    void loadSubstation();

    return () => {
      controller.abort();
    };
  }, [powerPlantId]);

  /*
   * Hide data belonging to the previously selected plant.
   */
  const hasCurrentPlantData = state.powerPlantId === powerPlantId;

  const substations =
    powerPlantId && hasCurrentPlantData ? state.substations : [];
  const selectedSubstationId = hasCurrentPlantData
    ? state.selectedSubstationId
    : null;
  const substationError = hasCurrentPlantData ? state.substationError : null;
  const selectSubstation = (substationId: string | null) => {
    setState((curr) => ({
      ...curr,
      selectedSubstationId: substationId,
    }));
  };
  const isLoadingSubstations = powerPlantId !== null && !hasCurrentPlantData;

  const substationOptions = substations.map((sub) => ({
    value: sub.id,
    label: `${sub.substationId}`,
  }));

  return {
    substations,
    selectedSubstationId,
    isLoadingSubstations,
    substationError,
    selectSubstation,
    substationOptions,
  };
};
