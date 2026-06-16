import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './styles/globals.css';
import './i18n';

// Sentry Initialization
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event) {
    // Strip sensitive information (e.g., income, phone) from the payload
    if (event.request && event.request.data) {
      try {
        let data = JSON.parse(event.request.data);
        if (data.profile) {
          if (data.profile.monthly_income) data.profile.monthly_income = '[FILTERED]';
          if (data.profile.phone) data.profile.phone = '[FILTERED]';
        }
        event.request.data = JSON.stringify(data);
      } catch (e) {
        // Not JSON or parse failed
      }
    }
    return event;
  },
});

// Fallback UI for Error Boundary
const ErrorFallback = () => (
  <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-mono">
    <h1 className="text-4xl mb-6 tracking-widest uppercase border-b-4 border-white pb-4">System Anomaly</h1>
    <p className="text-xl mb-12 max-w-lg text-center">An anomaly occurred. Recovering session.</p>
    <button 
      onClick={() => window.location.reload()}
      className="bg-white text-black px-12 py-4 uppercase tracking-widest font-bold hover:scale-105 transition-transform"
    >
      Restart Session
    </button>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
);
