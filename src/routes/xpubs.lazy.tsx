import { createLazyFileRoute } from '@tanstack/react-router';
import { Xpubs } from '@/components/Xpubs/xpubs.tsx';

export const Route = createLazyFileRoute('/xpubs')({
  component: Xpubs,
})
