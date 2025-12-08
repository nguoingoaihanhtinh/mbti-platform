import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "lucide-react": path.resolve(__dirname, "node_modules/lucide-react/dist/esm/lucide-react.js"),
    },
  },

  optimizeDeps: {
    include: ["lucide-react"],
  },
});
