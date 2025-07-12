// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from 'url'; // <-- Import the necessary function

// These two lines are the modern replacement for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Now the alias will be resolved correctly
      "@": path.resolve(__dirname, "./src"),
    },
  },
})