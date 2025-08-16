import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const packageJson = require('./package.json');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        '__APP_VERSION__': JSON.stringify(packageJson.version)
      },
      plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                // Don't cache external Google scripts
                navigateFallbackDenylist: [/^\/api/, /^\/auth/, /^\/docs/, /google/],
                // Ensure new content is served on next visit
                skipWaiting: true,
                clientsClaim: true,
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
      }
    };
});
