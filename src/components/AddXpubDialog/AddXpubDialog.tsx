import { Button } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input.tsx';
import { useSpvWalletClient } from '@/contexts';
import { errorWrapper } from '@/utils';
import { HD } from '@bsv/sdk';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CirclePlus, CircleX } from 'lucide-react';

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';

interface AddXpubDialogProps {
  className?: string;
}

const formSchema = z.object({
  xPriv: z.union([
    z
      .string()
      .refine((val) => val.startsWith('xprv'), 'xPriv should start with xprv')
      .refine((val) => val.length === 111, 'Invalid xPriv length.'),
    z.literal(''),
  ]),
  xPub: z
    .string()
    .refine((val) => val.startsWith('xpub'), 'xPub should starts with xpub.')
    .refine((val) => val.length === 111, 'Invalid xPub length.'),
});

const xPrivSchema = formSchema.pick({ xPriv: true });

export const AddXpubDialog = ({ className }: AddXpubDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const xPrivRef = useRef<HTMLInputElement>(null);
  const xPubRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      xPriv: '',
      xPub: '',
    },
  });

  const { spvWalletClient } = useSpvWalletClient();

  const mutation = useMutation({
    mutationFn: async (xpub: string) => {
      // At this point, spvWalletClient is defined; using non-null assertion.
      return await spvWalletClient!.AdminNewXpub(xpub, {});
    },
    onSuccess: () => queryClient.invalidateQueries(),
  });

  useEffect(() => {
    form.reset();
  }, [isOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { xPub } = values;
    try {
      HD.fromString(values.xPub);
      await mutation.mutateAsync(xPub);
      toast.success('xPub successfully added');
      form.reset();
    } catch (error) {
      toast.error('Unable to add xPub');
      errorWrapper(error);
    }
  };

  const debouncedXPriv = useDebouncedCallback(() => {
    const parsedXPriv = xPrivSchema.safeParse({ xPriv: form.getValues('xPriv') });

    if (form.getValues('xPriv').length === 0) {
      form.clearErrors();
      return;
    }
    form.trigger('xPriv');

    if (!parsedXPriv.success) {
      return;
    }

    try {
      const xPrivHD = HD.fromString(parsedXPriv.data.xPriv);
      const xPubString = xPrivHD.toPublic().toString();
      form.setValue('xPub', xPubString);
      toast.success('Converted xPriv to xPub');
    } catch (error) {
      toast.error('Unable to convert xPriv to xPub');
    }
  }, 700);

  const debouncedXPub = useDebouncedCallback(() => {
    if (form.getValues('xPub')?.length === 0) {
      form.clearErrors();
      return;
    }
    form.trigger('xPub');
  }, 700);

  const handeDialogToggle = () => {
    setIsOpen((prev) => !prev);
    form.reset();
  };

  const onXPrivChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('xPriv', e.target.value);
    debouncedXPriv();
  };

  const onXPubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('xPub', e.target.value);
    form.resetField('xPriv');
    debouncedXPub();
  };

  const onXPubClear = () => {
    form.reset();
    if (xPubRef.current) {
      xPubRef.current?.focus();
    }
  };

  const onXPrivClear = () => {
    form.resetField('xPriv');
    if (xPrivRef.current) {
      xPrivRef.current?.focus();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handeDialogToggle}>
      <DialogTrigger asChild className={className}>
        <Button size="sm" variant="secondary" className="h-10 gap-1">
          <CirclePlus className="mr-1" size={16} />
          Add xPub
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add xPub</DialogTitle>
              <DialogDescription>Get xpub from xpriv</DialogDescription>
            </DialogHeader>
            <FormField
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>xPriv</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="xprv..."
                      autoComplete="off"
                      className="pr-12"
                      {...field}
                      ref={xPrivRef}
                      onChange={onXPrivChange}
                    />
                  </FormControl>
                  <CircleX size={16} className="absolute top-9 right-4 cursor-pointer" onClick={onXPrivClear} />
                  <FormMessage />
                </FormItem>
              )}
              name="xPriv"
            />
            <FormField
              render={({ field }) => (
                <FormItem className="mt-2 relative">
                  <FormLabel>xPub</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="xpub..."
                      className="pr-12"
                      {...field}
                      ref={xPubRef}
                      onChange={(e) => onXPubChange(e)}
                    />
                  </FormControl>
                  <CircleX size={16} className="absolute top-9 right-4 cursor-pointer" onClick={onXPubClear} />
                  <FormMessage />
                </FormItem>
              )}
              name="xPub"
            />
            <DialogFooter className="mt-4">
              <Button type="submit">Add xPub</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
