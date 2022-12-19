import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  // clean: true,
  dts: true,
  watch: true,
  format: ['esm', 'cjs'],
  external: ['react', 'antd', '@fa/types'],
});
