let isGoogleScriptLoaded = false;
let googleScriptPromise: Promise<void> | null = null;

/**
 * Ensures that the Google API client script (gapi) is loaded into the page.
 * This is necessary for services that use gapi, such as Google Drive integration.
 * It memoizes the promise to avoid loading the script multiple times.
 */
export const ensureGoogleScriptsAreLoaded = (): Promise<void> => {
  if (isGoogleScriptLoaded) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      isGoogleScriptLoaded = true;
      googleScriptPromise = null;
      resolve();
    };
    script.onerror = (error) => {
      console.error("Failed to load Google API script", error);
      googleScriptPromise = null;
      reject(new Error("Failed to load Google API script."));
    };
    document.body.appendChild(script);
  });

  return googleScriptPromise;
};
