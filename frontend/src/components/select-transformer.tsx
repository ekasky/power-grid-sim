import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { useTransformers } from '@/hooks/use-transformers';

interface SelectTransformerProps extends Pick<
  ReturnType<typeof useTransformers>,
  | 'isLoadingTransformers'
  | 'selectTransformer'
  | 'selectedTransformerId'
  | 'transformerError'
  | 'transformerOptions'
  | 'transformers'
> {
  isSubmitting: boolean;
}

export const SelectTransformer = ({
  isLoadingTransformers,
  selectTransformer,
  selectedTransformerId,
  transformerError,
  transformerOptions,
  transformers,
  isSubmitting,
}: SelectTransformerProps) => {
  return (
    <div className='space-y-2'>
      <Label>Transformers</Label>

      <Select
        items={transformerOptions}
        value={selectedTransformerId}
        onValueChange={(value) => selectTransformer(value)}
        disabled={
          isLoadingTransformers || transformers.length === 0 || isSubmitting
        }
      >
        <SelectTrigger className='w-full'>
          <SelectValue
            placeholder={
              isLoadingTransformers
                ? 'Loading transformers...'
                : 'Select a transformer'
            }
          />
        </SelectTrigger>

        <SelectContent>
          {transformers.map((trans) => (
            <SelectItem key={trans.id} value={trans.id}>
              {trans.transformerId}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!isLoadingTransformers &&
        !transformerError &&
        transformers.length === 0 && (
          <p className='text-sm text-muted-foreground'>
            No transformers are available.
          </p>
        )}
    </div>
  );
};
