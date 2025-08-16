declare global {
    interface Window {
        gapi: any;
        google: any;
        gapiIsLoaded?: boolean;
        gisIsLoaded?: boolean;
    }
}

export const ensureGoogleScriptsAreLoaded = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const timeout = 15000; // 15 seconds timeout

    const checkScripts = () => {
      // Use the flags set by the onload callbacks in index.html
      if (window.gapiIsLoaded && window.gisIsLoaded) {
        console.log('Both Google scripts confirmed loaded by flags.');
        resolve();
      } else if (Date.now() - startTime > timeout) {
        console.error('Google script loading timed out.');
        console.error(`gapiIsLoaded: ${window.gapiIsLoaded}, gisIsLoaded: ${window.gisIsLoaded}`);
        reject(new Error("Failed to load Google scripts in time. Check browser console for network errors."));
      } else {
        setTimeout(checkScripts, 100); // Check again in 100ms
      }
    };

    checkScripts();
  });
};
