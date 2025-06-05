import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 8080,
      host: true,
      proxy: {
        '/api/generate-content': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: (path) => '/v1/messages',
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              // Add Anthropic headers
              const apiKey = env.VITE_CLAUDE_API_KEY;
              if (!apiKey) {
                console.error('VITE_CLAUDE_API_KEY is not set in environment variables');
                return;
              }
              proxyReq.setHeader('x-api-key', apiKey);
              proxyReq.setHeader('anthropic-version', '2023-06-01');
              proxyReq.setHeader('content-type', 'application/json');
              proxyReq.setHeader('anthropic-dangerous-direct-browser-access', 'true');
            });

            proxy.on('proxyRes', (proxyRes, req, res) => {
              if (proxyRes.statusCode === 401) {
                console.error('Authentication failed. Check your API key and version.');
              }
            });

            proxy.on('error', (err, req, res) => {
              console.error('Proxy error:', err);
              res.writeHead(500, {
                'Content-Type': 'text/plain',
              });
              res.end('Proxy error: ' + err.message);
            });
          },
        },
      }
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-slot',
              '@radix-ui/react-tabs',
              'class-variance-authority',
              'clsx',
              'tailwind-merge'
            ]
          }
        }
      }
    },
    preview: {
      allowedHosts: ['next-trend-ai-v2.up.railway.app', 'app.nextrend.ai'],
    },
  };
});
