
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ensureGoogleScriptsAreLoaded } from './services/googleScriptLoader';

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Wait for Google scripts to be loaded before starting the React app.
ensureGoogleScriptsAreLoaded()
  .then(() => {
    startApp();
  })
  .catch(error => {
    console.error(error);
    // Optionally, render an error message to the user
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = '<div style="text-align: center; padding: 2rem; font-family: sans-serif;">'
        + '<h1>Error</h1>'
        + '<p>Could not load necessary Google services. Please check your internet connection and try again.</p>'
        + '</div>';
    }
  });

   