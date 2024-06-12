import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { AuthContext, SpvWalletContext } from '@/contexts';
import { QueryClient } from '@tanstack/react-query';

interface RouterContext {
  auth: AuthContext;
  queryClient: QueryClient;
  spvWallet: SpvWalletContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
