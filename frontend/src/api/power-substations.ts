import type { ApiErrorResponse } from '@/api/error';

export interface PowerSubstation {
  id: string;
  substationId: string;
  initialInstallationCost: number | string;
  recurringMaintenanceCost: number | string;
  location: {
    x: number;
    y: number;
  };
}

export interface UpdatePowerSubstationRequest {
  substationId: string;
  initialInstallationCost: number;
  recurringMaintenanceCost: number;
  location: {
    x: number;
    y: number;
  };
}

export const getPowerSubstations = async (
  powerPlantId: string,
  signal?: AbortSignal,
): Promise<PowerSubstation[]> => {
  const response = await fetch(
    `/api/plants/${encodeURIComponent(powerPlantId)}/substations`,
    {
      method: 'GET',
      signal,
      headers: {
        Accept: 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to retrieve power substations: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Invalid response: expected an array of power substations');
  }

  return data as PowerSubstation[];
};

export const deletePowerSubstation = async (
  powerSubstationId: string,
): Promise<void> => {
  const response = await fetch(
    `/api/substations/${encodeURIComponent(powerSubstationId)}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as ApiErrorResponse | null;

    throw new Error(
      errorBody?.message ||
        `Failed to delete power substation: ${response.status}`,
    );
  }
};

export const updatePowerSubstation = async (
  powerSubstationId: string,
  request: UpdatePowerSubstationRequest,
): Promise<PowerSubstation> => {
  const response = await fetch(`/api/substations/${powerSubstationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as ApiErrorResponse | null;

    throw new Error(
      errorBody?.message ||
        `Failed to update power substation: ${response.status}`,
    );
  }

  const data = await response.json();

  if (!data) {
    throw new Error('Invalid power substation response');
  }

  return data as PowerSubstation;
};
