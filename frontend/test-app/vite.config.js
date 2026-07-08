import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// App de consumo: roda o Vite normal. Resolve `map-manager` via workspace
// (symlink em node_modules apontando para packages/map-manager).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/soils": {
        target: "https://soils-bff.vercel.app/soils",
        changeOrigin: true,
        rewrite: () => "",
      },
    },
  },
});
