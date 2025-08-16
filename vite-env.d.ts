/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_GOOGLE_API_KEY: string;
  readonly VITE_BUILD_TIMESTAMP: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
