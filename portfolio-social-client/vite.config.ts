// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      open: true,
    },
    build: {
      outDir: "build",
      sourcemap: true,
    },
    define: {
      "process.env.VITE_BASE_URL": JSON.stringify(env.VITE_BASE_URL),
    },
  };
});
