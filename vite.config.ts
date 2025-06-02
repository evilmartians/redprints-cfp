import react from "@vitejs/plugin-react";
import { resolve } from 'path';
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import RubyPlugin from "vite-plugin-ruby";

export default defineConfig({
  plugins: [react(), tailwindcss(), RubyPlugin()],
  resolve: {
    alias: {
      '@assets': resolve(__dirname, 'app/assets'),
    },
  },
});
