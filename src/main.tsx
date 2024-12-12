import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';
import './index.css';
import { Buffer } from 'buffer';

// We need this global assignment to be able to use Buffer from different libraries.
// If no other plugin sets the buffer it will be seen as undefined by the browser.
// i.e HD.fromString() uses Buffer underneath and causes app to throw errors
globalThis.Buffer = Buffer;

// Render the app
const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
