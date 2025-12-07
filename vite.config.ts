import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/setupTest.ts'],
    },
    plugins: [
      tsconfigPaths(),
      react(),
      eslint(),
      checker({
        typescript: true,
      }),
    ],
    define: {
      'process.env.REACT_APP_ENV_NAME': JSON.stringify(env.REACT_APP_ENV_NAME),
      'process.env.REACT_APP_SCORE_ROOT_URL': JSON.stringify(env.REACT_APP_SCORE_ROOT_URL),
      'process.env.REACT_APP_INVOICE_OPERATION_ROOT_URL': JSON.stringify(env.REACT_APP_INVOICE_OPERATION_ROOT_URL),
      'process.env.REACT_APP_ANALYSIS_ROOT_URL': JSON.stringify(env.REACT_APP_ANALYSIS_ROOT_URL),
      'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY),
      'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
      'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
      'process.env.VITE_FIREBASE_DATABASE_URL': JSON.stringify(env.VITE_FIREBASE_DATABASE_URL),


    },
    build: {
      outDir: mode === 'production' ? 'dist-production' : mode === 'demo' ? 'dist-demo' : 'dist',
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
});
