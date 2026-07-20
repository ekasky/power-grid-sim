import type { ApiErrorResponse } from '@/api/error';

export interface PowerCompany {
  id: string;
  longName: string;
  shortName: string;
  standardRate: number | string;
  totalRevenue?: number | string;
  totalCosts?: number | string;
  location: {
    x: number;
    y: number;
  };
}

export interface CreatePowerCompanyRequest {
  longName: string;
  shortName: string;
  standardRate: number;
  location: {
    x: number;
    y: number;
  };
}

export interface UpdatePowerCompanyRequest {
  longName: string;
  shortName: string;
  standardRate: number;
  location: {
    x: number;
    y: number;
  };
}

export const getPowerCompanies = async (
  signal?: AbortSignal,
): Promise<PowerCompany[]> => {
  const response = await fetch('/api/companies', {
    method: 'GET',
    signal,
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to retrieve power companies: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(`Invalid response: expected an array of power companies`);
  }

  return data as PowerCompany[];
};

export const deletePowerCompany = async (companyId: string): Promise<void> => {
  const response = await fetch(`/api/companies/${companyId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as ApiErrorResponse | null;

    throw new Error(
      errorBody?.message ??
        `Failed to delete power company: ${response.status}`,
    );
  }
};

export const updatePowerCompany = async (
  companyId: string,
  request: UpdatePowerCompanyRequest,
): Promise<PowerCompany> => {
  const response = await fetch(`/api/companies/${companyId}`, {
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
      errorBody?.message ??
        `Failed to update power company: ${response.status}`,
    );
  }

  const data = await response.json();

  return data as PowerCompany;
};

export const createPowerCompany = async (
  request: CreatePowerCompanyRequest,
): Promise<PowerCompany> => {
  const response = await fetch(`/api/companies`, {
    method: 'POST',
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
      errorBody?.message ??
        `Failed to create power company: ${response.status}`,
    );
  }

  const data = await response.json();

  return data as PowerCompany;
};
