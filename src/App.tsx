import { ConfigProvider } from '@4chain-ag/react-configuration';
import { AuthProvider, SpvWalletProvider, ThemeProvider, useAuth, useSpvWalletClient } from '@/contexts';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen.ts';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { auth: undefined!, queryClient, spvWallet: undefined! },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  const spvWallet = useSpvWalletClient();

  return <RouterProvider router={router} context={{ auth, spvWallet }} />;
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ConfigProvider>
        <SpvWalletProvider>
          <AuthProvider>
            <TooltipProvider>
              <QueryClientProvider client={queryClient}>
                <InnerApp />
              </QueryClientProvider>
            </TooltipProvider>
          </AuthProvider>
        </SpvWalletProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
