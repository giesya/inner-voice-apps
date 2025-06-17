import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    port: 5502,
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        importScripts: [
          'workbox-injection-point.js'
        ],
        runtimeCaching: [
          {
            urlPattern: new RegExp('^https://story-api\\.dicoding\\.dev/v1/.*'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
            },
          },
          {
            urlPattern: new RegExp('^https://story-api\\.dicoding\\.dev/v1/.*\\.(?:png|jpg|jpeg|svg|gif)'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdnjs-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/unpkg\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unpkg-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      manifest: {
        name: "Inner Voice: Share Your Story!",
        short_name: "Inner Voice",
        start_url: "/",
        display: "standalone",
        background_color: "#fff",
        theme_color: "#6c2eb7",
        description: "Aplikasi berbagi cerita dengan fitur offline dan push notification.",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ],
      },
      devOptions: {
        enabled: true
      }
    }),
  ],
});