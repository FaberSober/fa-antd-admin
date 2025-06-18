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
    '@tinymce/tinymce-react',
    'axios',
    '@ant-design/icons',
    'antd',
    'ahooks',
    'dayjs',
    'fa-cron-react-editor',
    'lodash',
    'qs',
    'react',
    'react-router-dom',
    'react-contexify',
    'uuid',
    'use-bus',
  ],
});
