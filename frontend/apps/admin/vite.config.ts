import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react-swc';
import react from '@vitejs/plugin-react';
// import importToCDN, { autoComplete } from 'vite-plugin-cdn-import'
import Pages from 'vite-plugin-pages';
// import { visualizer } from 'rollup-plugin-visualizer';
import * as path from 'path';
import UnoCSS from 'unocss/vite'
import { sentryVitePlugin } from "@sentry/vite-plugin";


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log('loadEnv(mode, process.cwd())', env);
  return {
    define: {
      // 注入全局变量
      __FA_SECRET__: JSON.stringify(env.VITE_APP_FA_SECRET),
      __ADMIN_SUPER_PWD__: JSON.stringify(env.VITE_APP_ADMIN_SUPER_PWD),
      FaFrom: JSON.stringify(env.VITE_APP_FA_FROM),
      FaVersionCode: JSON.stringify(env.VITE_APP_FA_VERSION_CODE),
      FaVersionName: JSON.stringify(env.VITE_APP_FA_VERSION_NAME),
    },
    plugins: [
      // importToCDN.default({
      //   modules: [
      //     // 使用静态资源
      //     // autoComplete('react'),
      //     // autoComplete('react-dom'),
      //     {
      //       name: 'three',
      //       var: 'THREE',
      //       path: 'three.min.js',
      //     },
      //   ],
      //   // 静态js、css文件的路径拼接规则
      //   prodUrl: '/plugins/{name}/{version}/{path}',
      // }),
      UnoCSS(),
      react(),
      Pages({
        dirs: [
          { dir: 'src/pages', baseRoute: '' },
          { dir: 'features/*/pages', baseRoute: '' },
        ],
        exclude: ['**/components/*.tsx', '**/modal/*.tsx', '**/cube/*.tsx', '**/drawer/*.tsx', '**/helper/*.tsx', '**/context/*.tsx', '**/chart/*.tsx', '**/*.ts'],
      }),
      // visualizer({
      //   open: true, //注意这里要设置为true，否则无效
      //   // gzipSize: true,
      //   // brotliSize: true,
      // }),
      // Put the Sentry vite plugin after all other plugins
      sentryVitePlugin({
        org: "faberstudio",
        project: "fa-doc",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      }),
    ],
    //* css模块化
    css: {
      modules: {
        // css模块化 文件以.module.[css|less|scss]结尾
        // 回调必须返回 `local`，`global`，或者 `pure`
        mode: (resourcePath: string) => {
          // 形如xx.module.less的样式，会使用local模块化编译。其他的则返回全局样式
          if (/\.module\.(css|scss)$/i.test(resourcePath)) {
            return 'local';
          }
          return 'global';
        },
        generateScopedName: '[name]__[local]___[hash:base64:5]',
        hashPrefix: 'prefix',
      },
    },
    resolve: {
      alias: [
        { find: /^~@/, replacement: path.resolve(__dirname, 'src') },
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@features', replacement: path.resolve(__dirname, 'features') },
      ],
    },
    build: {
      sourcemap: true,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        // external: [],
        output: {
          manualChunks: {
            react: ['react'],
            'react-dom': ['react-dom'],
            'react-grid-layout': ['react-grid-layout'],
            lodash: ['lodash'],
            dayjs: ['dayjs'],
            // 'react-monaco-editor': ['react-monaco-editor'],
            'pdfjs-dist': ['pdfjs-dist'],
            'react-pdf-viewer': ['@react-pdf-viewer/core', '@react-pdf-viewer/default-layout', '@react-pdf-viewer/highlight'],
            '@fa/ui': ['@fa/ui'],
            '@fa/icons': ['@fa/icons'],
            // antd 最新版5.x 在vite中分包后报错: https://github.com/ant-design/ant-design/issues/52436
            // antd: ['antd', '@ant-design/colors', '@ant-design/icons'],
            echarts: ['echarts'],
            three: ['three', 'three-stdlib', '@react-three/drei', '@react-three/fiber'],
          },
        },
      },
    },
    server: {
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});
