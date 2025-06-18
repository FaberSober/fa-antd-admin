import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  // clean: true,
  dts: true,
  watch: false,
  format: ['esm', 'cjs'],
  external: [
    'axios',
    'antd',
    'ahooks',
    'dayjs',
    'lodash',
    'react',
    'uuid',
    'use-bus',
  ],
});
