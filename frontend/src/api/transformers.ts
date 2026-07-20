import type { ApiErrorResponse } from '@/api/error';

export interface Transformer {
  id: string;
  transformerId: string;
  initialInstallationCost: number | string;
  recurringMaintenanceCost: number | string;
  location: {
    x: number;
    y: number;
  };
}

export interface UpdateTransformerRequest {
  transformerId: string;
  initialInstallationCost: number;
  recurringMaintenanceCost: number;
  location: {
    x: number;
    y: number;
  };
}

export interface CreateTransformerRequest {
  transformerId: string;
  initialInstallationCost: number;
  recurringMaintenanceCost: number;
  location: {
    x: number;
    y: number;
  };
}

export const getTransformers = async (
  powerSubstationId: string,
  signal?: AbortSignal,
): Promise<Transformer[]> => {
  const response = await fetch(
    `/api/substations/${powerSubstationId}/transformers`,
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
      `Failed to retrive transformers: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Invalid response: expected an array of transformers');
  }

  return data as Transformer[];
};

export const updateTransformer = async (
  transformerId: string,
  request: UpdateTransformerRequest,
): Promise<Transformer> => {
  const response = await fetch(`/api/transformers/${transformerId}`, {
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
      errorBody?.message ?? `Failed to update transformer: ${response.status}`,
    );
  }

  const data = await response.json();

  if (!data) {
    throw new Error('Invalid transformer response');
  }

  return data as Transformer;
};

export const deleteTransformer = async (
  transformerId: string,
): Promise<void> => {
  const response = await fetch(`/api/transformers/${transformerId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as ApiErrorResponse | null;

    throw new Error(
      errorBody?.message ?? `Failed to delete transformer: ${response.status}`,
    );
  }
};
