import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  
  const isDevelopment = mode === "development";

  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      open: true,
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      outDir: "build",
      sourcemap: true,
    },
    define: {
      "process.env.VITE_BASE_URL": isDevelopment ? JSON.stringify("/api") : JSON.stringify(env.VITE_BASE_URL),
    },
  };
});