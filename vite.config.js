import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "development-source-entry",
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          if (request.url === "/" || request.url?.startsWith("/?")) {
            request.url = "/app/index.html" + request.url.slice(1);
          }
          next();
        });
      },
    },
  ],
  base: "./",
  build: { rollupOptions: { input: "app/index.html" } },
  worker: { format: "es" },
  server: { host: "0.0.0.0", port: 3000, strictPort: true },
});
