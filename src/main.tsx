import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from 'sonner';
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { preloadFonts } from './lib/pdf-fonts'

import "./main.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
    <Toaster />
  </ErrorBoundary>
)

// Preload PDF fonts in the background for better performance
preloadFonts();
