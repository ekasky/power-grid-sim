import { useCallback, useEffect, useState } from 'react';

export interface Entity {
  id: string;
}

interface EntityListState<T> {
  queryKey: string | null;
  items: T[];
  loadError: string | null;
}

interface UseEntityListOptions<T> {
  queryKey: string | null;

  loadItems: (signal: AbortSignal) => Promise<T[]>;
  deleteItem: (id: string) => Promise<void>;

  loadErrorFallback: string;
  deleteErrorFallback: string;
}

export const useEntityList = <T extends Entity>({
  queryKey,
  loadItems,
  deleteItem,
  loadErrorFallback,
  deleteErrorFallback,
}: UseEntityListOptions<T>) => {
  const [state, setState] = useState<EntityListState<T>>({
    queryKey: null,
    items: [],
    loadError: null,
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (queryKey === null) {
      return;
    }

    const controller = new AbortController();
    const currentQueryKey = queryKey;

    const load = async () => {
      try {
        const items = await loadItems(controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setState({
          queryKey: currentQueryKey,
          items,
          loadError: null,
        });
      } catch (error: unknown) {
        if (
          controller.signal.aborted ||
          (error instanceof DOMException && error.name === 'AbortError')
        ) {
          return;
        }

        console.error(error);

        setState({
          queryKey: currentQueryKey,
          items: [],
          loadError: error instanceof Error ? error.message : loadErrorFallback,
        });
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, [queryKey, loadItems, loadErrorFallback]);

  // Dont expse the data from the prev parent that was selected
  const hasCurrentData = state.queryKey === queryKey;

  const items = queryKey !== null && hasCurrentData ? state.items : [];

  const loadError =
    queryKey !== null && hasCurrentData ? state.loadError : null;

  const isLoading = queryKey !== null && !hasCurrentData;

  const removeItem = useCallback(
    async (item: T) => {
      try {
        setDeletingId(item.id);
        setDeleteError(null);

        await deleteItem(item.id);

        setState((curr) => {
          if (curr.queryKey !== queryKey) {
            return curr;
          }

          return {
            ...curr,
            items: curr.items.filter((currItem) => currItem.id !== item.id),
          };
        });
      } catch (error: unknown) {
        console.error(error);

        setDeleteError(
          error instanceof Error ? error.message : deleteErrorFallback,
        );
      } finally {
        setDeletingId(null);
      }
    },
    [deleteItem, deleteErrorFallback, queryKey],
  );

  const updateItem = useCallback(
    async (item: T) => {
      setState((curr) => {
        if (curr.queryKey !== queryKey) {
          return curr;
        }

        return {
          ...curr,
          items: curr.items.map((i) => (i.id === i.id ? item : i)),
        };
      });
    },
    [queryKey],
  );

  return {
    items,
    isLoading,
    loadError,
    deletingId,
    deleteError,
    removeItem,
    updateItem,
  };
};
