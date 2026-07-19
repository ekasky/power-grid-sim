import type { ApiErrorResponse } from '@/api/error';

export interface PowerPlant {
  id: string;
  plantId: string;
  initialBuildCost: number | string;
  recurringGenerationCost: number | string;
  powerProduced: number | string;
}

export const getPowerPlants = async (
  companyId: string,
  signal?: AbortSignal,
): Promise<PowerPlant[]> => {
  const response = await fetch(`/api/companies/${companyId}/plants`, {
    method: 'GET',
    signal,
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to retrieve power plants: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Invalid response: expected an array of power plants');
  }

  return data as PowerPlant[];
};

export const deletePowerPlant = async (powerPlantId: string): Promise<void> => {
  const response = await fetch(`/api/plants/${powerPlantId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'applicaiton/json',
    },
  });

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as ApiErrorResponse | null;

    throw new Error(
      errorBody?.message || `Failed to delete power plant: ${response.status}`,
    );
  }
};
