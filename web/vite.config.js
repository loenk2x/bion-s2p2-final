import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Diperlukan supaya server pengembangan bisa dihubungi dari dalam kontainer Docker.
    host: true
  }
});
