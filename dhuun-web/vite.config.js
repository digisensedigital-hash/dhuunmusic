import { defineConfig }
  from 'vite';

import react
  from '@vitejs/plugin-react';

import { VitePWA }
  from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType:
        'autoUpdate',

      includeAssets: [
        'DhuunMusic_Logo.png',
        'favicon.svg'
      ],

      workbox: {
        skipWaiting:
          true,

        clientsClaim:
          true,

        cleanupOutdatedCaches:
          true,

        globPatterns: [
          '**/*.{js,css,html,png,svg,ico,json}'
        ]
      },

      manifest: {
        name:
          'Dhuun Music',

        short_name:
          'Dhuun',

        description:
          'Dhuun Music Streaming Platform',

        theme_color:
          '#07010F',

        background_color:
          '#07010F',

        display:
          'standalone',

        orientation:
          'portrait',

        start_url:
          '/',

        icons: [
          {
            src: '/DhuunMusic_Logo.png',

            sizes:
              '192x192',

            type:
              'image/png',

            purpose:
              'any maskable'
          },

          {
            src: '/DhuunMusic_Logo.png',

            sizes:
              '512x512',

            type:
              'image/png',

            purpose:
              'any maskable'
          }
        ]
      }
    })
  ]
});