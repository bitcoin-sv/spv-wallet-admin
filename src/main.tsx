import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { ConfigProvider } from '@4chain-ag/react-configuration';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { SpvWalletProvider } from '@/contexts/SpvWalletContext.tsx';
//    "@bsv/spv-wallet-js-client": "^1.0.0-beta.5",

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <SpvWalletProvider>
        <ConfigProvider>
          <RouterProvider router={router} />
        </ConfigProvider>
      </SpvWalletProvider>
    </StrictMode>,
  );
}
