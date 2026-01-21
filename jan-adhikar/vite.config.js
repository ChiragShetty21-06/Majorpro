import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react': path.resolve(__dirname, 'node_modules/preact/compat'),
      'react-dom': path.resolve(__dirname, 'node_modules/preact/compat'),
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/preact/jsx-runtime')
    }
  },
  optimizeDeps: {
    include: [
      'preact/compat',
      'preact/hooks',
      'preact/jsx-runtime',
      'react-markdown'
    ],
    esbuildOptions: {
      resolveExtensions: ['.js', '.jsx'],
      jsx: 'automatic'
    }
  }
});
