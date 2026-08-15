import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const sharedDir = path.resolve(here, "..", "shared");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@shared": sharedDir }
  },
  server: {
    port: 5173,
    // Needed so the dev server can be reached from inside a Docker container.
    host: true,
    // shared/ sits outside the Vite root, so it must be allowed explicitly.
    fs: { allow: [here, sharedDir] }
  }
});
