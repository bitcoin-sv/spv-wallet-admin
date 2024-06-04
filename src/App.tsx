import { ConfigProvider } from '@4chain-ag/react-configuration';
import { AuthProvider, SpvWalletProvider, ThemeProvider, useAuth } from '@/contexts';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen.ts';

// Create a new router instance
const router = createRouter({ routeTree, context: { auth: undefined! } });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const auth = useAuth();
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ConfigProvider>
        <SpvWalletProvider>
          <AuthProvider>
            <RouterProvider router={router} context={{ auth }} />
          </AuthProvider>
        </SpvWalletProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
