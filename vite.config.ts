import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    // Expose version from package.json
    process.env.VITE_APP_VERSION = process.env.npm_package_version;
    
    return {
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
