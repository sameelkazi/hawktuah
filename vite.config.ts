import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Ensure it's always a string, never undefined
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
    },
    server: {
      host: '0.0.0.0',
    }
  };
});