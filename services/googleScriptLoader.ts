export const ensureGoogleScriptsAreLoaded = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const timeout = 10000; // 10 seconds timeout

    const checkScripts = () => {
      // Check if both gapi (for Drive/Sheets) and gsi (for auth) are loaded
      if (window.gapi && window.google?.accounts?.id) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error("Failed to load Google scripts in time."));
      } else {
        setTimeout(checkScripts, 100); // Check again in 100ms
      }
    };

    checkScripts();
  });
};
