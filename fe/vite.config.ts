import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "path";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Tambahkan resolve di dalam objek konfigurasi utama
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
});