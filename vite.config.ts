import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// TanStack Start usa src/server.ts como entrada de servidor por convenção
// (nosso wrapper de erro de SSR). O alias "@/..." vem do tsconfig via
// vite-tsconfig-paths.
export default defineConfig({
  server: {
    port: 8080,
    host: true,
  },
  plugins: [tsConfigPaths(), tailwindcss(), tanstackStart(), viteReact()],
});
