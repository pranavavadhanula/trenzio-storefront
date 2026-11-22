import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { trevoriApiPlugin } from './server/vitePluginApi';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.OPENAI_API_KEY || process.env.OPENAI_API_KEY || '';

  return {
    plugins: [
      react(),
      trevoriApiPlugin(apiKey),
    ],
  };
});
