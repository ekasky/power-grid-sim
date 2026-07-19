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
