import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';

// Read package.json to get the version
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    // Fail the build if the essential API key is not provided
    if (!env.VITE_GEMINI_API_KEY) {
        throw new Error("VITE_GEMINI_API_KEY is not defined in your .env file. Build failed.");
    }

    return {
      define: {
        // Define variables to be available in the app code
        'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
        'import.meta.env.VITE_BUILD_TIMESTAMP': JSON.stringify(new Date().toISOString()),
      },
      plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                // Aggressively force service worker updates
                skipWaiting: true,
                clientsClaim: true,
                // Don't cache external Google scripts or our own API calls
                navigateFallbackDenylist: [/^\/api/, /google/],
            },
            // Disable PWA/SW in development to avoid caching issues
            devOptions: {
                enabled: false
            }
        })
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        host: true
      }
    };
});
