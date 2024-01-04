import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@utils": "/src/utils",
      "@store": "/src/store",
      "@types": "/src/utils/types",
      "@dummies": "/src/utils/data",
    },
  },
});
