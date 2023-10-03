import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import ViteCompression from "vite-plugin-compression";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      ext: ".gz",
    }),
    VitePWA({
      includeAssets: [
        "favicon-16x16.png",
        "favicon-32x32.png",
        "apple-touch-icon.png",
        "maskable_icon.png",
      ],
      manifest: {
        name: "FestPay",
        short_name: "FestPay",
        description: "Gerenciamento de festas que só o FestPay pode trazer!",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/assets/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/assets/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/assets/maskable_icon.png",
            sizes: "196x196",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      registerType: "autoUpdate",
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 3000,
    minify: {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        output: {
          comments: false,
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
  },
  server: {
    middleware: {
      customHeaders(req, res) {
        if (!res.getHeader("Content-Encoding")) {
          res.setHeader("Content-Encoding", "gzip");
        }
      },
    },
  },
});
