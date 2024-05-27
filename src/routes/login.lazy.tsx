import { createLazyFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/Login/login.tsx';

export const Route = createLazyFileRoute('/login')({
  component: LoginForm
})
