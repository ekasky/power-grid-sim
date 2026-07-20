import { getTransformers, type Transformer } from '@/api/transformers';
import { useEffect, useState } from 'react';

interface TransformerState {
  substationId: string | null;
  transformers: Transformer[];
  selectedTransformerId: string | null;
  transformerError: string | null;
}

export const useTransformers = (substationId: string | null) => {
  const [state, setState] = useState<TransformerState>({
    substationId: substationId,
    transformers: [],
    selectedTransformerId: null,
    transformerError: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadTransformers = async () => {
      try {
        if (!substationId) {
          return;
        }

        const transformers = await getTransformers(
          substationId,
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        setState({
          substationId,
          transformers,
          selectedTransformerId: transformers[0]?.id ?? null,
          transformerError: null,
        });
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);

        if (!controller.signal.aborted) {
          setState({
            substationId: substationId,
            transformers: [],
            selectedTransformerId: null,
            transformerError:
              error instanceof Error
                ? error.message
                : 'Unable to load transformers',
          });
        }
      }
    };

    void loadTransformers();

    return () => {
      controller.abort();
    };
  }, [substationId]);

  /*
   * Hide data belonging to the previously selected plant.
   */
  const hasCurrentSubstationData = state.substationId === substationId;

  const transformers =
    substationId && hasCurrentSubstationData ? state.transformers : [];
  const selectedTransformerId = hasCurrentSubstationData
    ? state.selectedTransformerId
    : null;
  const transformerError = hasCurrentSubstationData
    ? state.transformerError
    : null;
  const selectTransformer = (substationId: string | null) => {
    setState((curr) => ({
      ...curr,
      selectedTransformerId: substationId,
    }));
  };
  const isLoadingTransformers =
    substationId !== null && !hasCurrentSubstationData;

  const transformerOptions = transformers.map((trans) => ({
    value: trans.id,
    label: `${trans.transformerId}`,
  }));

  return {
    transformers,
    selectedTransformerId,
    isLoadingTransformers,
    transformerError,
    selectTransformer,
    transformerOptions,
  };
};
