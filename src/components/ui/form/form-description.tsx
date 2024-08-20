import * as React from 'react';
import { cn } from '@/lib/utils.ts';
import { useFormField } from '@/components/ui/form/use-form-field.tsx';

export const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return <p ref={ref} id={formDescriptionId} className={cn('text-sm text-muted-foreground', className)} {...props} />;
  },
);

FormDescription.displayName = 'FormDescription';
