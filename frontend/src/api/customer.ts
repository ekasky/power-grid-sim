import type { ApiErrorResponse } from '@/api/error';
import type { CountResponse } from '@/api/types';

export type CustomerType = 'RESIDENTIAL' | 'COMMERCIAL';

export interface Customer {
  id: string;
  accountNumber: string;
  name: string;
  customerType: CustomerType;
  location: {
    x: number;
    y: number;
  };
}

export interface CreateCustomerRequest {
  accountNumber: string;
  name: string;
  customerType: CustomerType;
  location: {
    x: number;
    y: number;
  };
}

export interface UpdateCustomerRequest {
  accountNumber: string;
  name: string;
  location: {
    x: number;
    y: number;
  };
}

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

export const createCustomer = async (
  transformerId: string,
  request: CreateCustomerRequest,
): Promise<Customer> => {
  const response = await fetch(`/api/transformers/${transformerId}/customers`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as ApiErrorResponse | null;

    throw new Error(
      errorBody?.message ?? `Failed to create customer: ${response.status}`,
    );
  }

  const data = await response.json();

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid customer response');
  }

  return data as Customer;
};

export const getCustomers = async (
  powerCompanyId: string,
  signal?: AbortSignal,
): Promise<Customer[]> => {
  const response = await fetch(`/api/companies/${powerCompanyId}/customers`, {
    method: 'GET',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to retrieve customers: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(`Invalid response: expected an array of customers`);
  }

  return data as Customer[];
};

export const deleteCustomer = async (customerId: string): Promise<void> => {
  const response = await fetch(`/api/customers/${customerId}`, {
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
      errorBody?.message ?? `Failed to delete customer: ${response.status}`,
    );
  }
};

export const updateCustomer = async (
  customerId: string,
  request: UpdateCustomerRequest,
): Promise<Customer> => {
  const response = await fetch(`/api/customers/${customerId}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as ApiErrorResponse | null;

    throw new Error(
      errorBody?.message ?? `Failed to update customer: ${response.status}`,
    );
  }

  const data = await response.json();

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid customer response');
  }

  return data as Customer;
};
