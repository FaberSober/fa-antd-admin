import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      rollupTypes: true,        // 关键：合并所有声明为最完美的单一类型文件
      tsconfigPath: './tsconfig.json',
      // 让 IDE 跳转到源码而不是 dist
      // beforeWriteFile: (filePath, content) => ({
      //   filePath: filePath.replace('/dist/', '/src/'),
      //   content,
      // }),
      // 1. 确保 outputDir 与 Rollup/Vite 的 dist 目录一致
      outDir: 'dist',
    }),
  ],

  build: {
    // 启用库模式
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'faUi', // 全局变量名称，用于 UMD/IIFE 格式
      fileName: (format) => `index.${format}.js`, // 输出文件名格式 (index.es.js, index.umd.js)
      formats: ['es', 'cjs'],
    },
    // 配置输出目录
    outDir: 'dist',
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'antd',
        '@ant-design/icons',
        '@tinymce/tinymce-react',
        // 确保将 package.json 中的所有 peerDependencies 都列在这里
        // /@ant-design\/icons/,
        // /@tinymce\/tinymce-react/,
        'ahooks',
        'dayjs',
        'lodash',
        'axios',
        'fa-cron-react-editor',
        'react-contexify',
        'react-use',
        'uuid',
        'use-bus',
        'qs',
        'crypto-js',
        'chroma-js',
        '@dnd-kit/core',
        '@dnd-kit/sortable',
        '@dnd-kit/utilities',
      ],
      output: {
        banner: "'use client';",
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
        // 让 CSS 单独成文件（方便外部引用）
        // assetFileNames: (assetInfo) => {
        //   console.log('assetInfo', assetInfo.originalFileNames)
        //   if (assetInfo.name?.endsWith('.css')) {
        //     return assetInfo.name === 'styles.css' ? 'styles.css' : 'index.css'
        //   }
        //   return 'assets/[name].[hash][extname]'
        // },
      },
    },
    target: 'es2022',
    sourcemap: true,
    minify: 'esbuild',
    cssCodeSplit: true,
  },

  resolve: {
    alias: {
      '@ui': resolve(__dirname, 'src'),
    },
  },
})
