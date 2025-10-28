import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Add Node.js global variable polyfills for browser environment
    global: 'globalThis',
    'process.env': {}
  },
  optimizeDeps: {
    exclude: ['fhevm'],
    esbuildOptions: {
      // Define global variable replacements
      define: {
        global: 'globalThis'
      }
    }
  },
  assetsInclude: ['**/*.wasm'],
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('ethers')) {
              return 'ethers-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  }
}));
