import type { ApiErrorResponse } from '@/api/error';
import type { CountResponse } from '@/api/types';

export const getCustomerCount = async (
  signal?: AbortSignal,
): Promise<number> => {
  const response = await fetch('/api/customers/count', {
    method: 'GET',
    signal,
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as ApiErrorResponse | null;

    throw new Error(
      errorBody?.message ??
        `Failed to retrieve customer count: ${response.status}`,
    );
  }

  const data = (await response.json()) as CountResponse;

  if (typeof data.count !== 'number') {
    throw new Error(`Invalid response: expected a numeric customer count`);
  }

  return data.count;
};
