import { defineConfig } from "vite";
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
