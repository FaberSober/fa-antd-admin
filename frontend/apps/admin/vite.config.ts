import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import Pages from 'vite-plugin-pages';
import { visualizer } from 'rollup-plugin-visualizer';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log('loadEnv(mode, process.cwd())', env);
  return {
    plugins: [
      react(),
      Pages({
        dirs: [
          { dir: 'src/pages', baseRoute: '' },
          { dir: 'features/*/pages', baseRoute: '' },
        ],
        exclude: ['**/components/*.tsx', '**/modal/*.tsx', '**/cube/*.tsx', '**/drawer/*.tsx', '**/helper/*.tsx'],
      }),
      visualizer({
        open: true, //注意这里要设置为true，否则无效
        gzipSize: true,
        brotliSize: true,
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
      // terserOptions: {
      //   compress: {
      //     drop_console: true,
      //     drop_debugger: true
      //   }
      // },
      rollupOptions: {
        // external: [],
        output: {
          manualChunks: {
            lodash: ['lodash'],
            'react-dom': ['react-dom'],
            // fortawesome: [
            //   '@fortawesome/fontawesome-svg-core',
            //   '@fortawesome/free-solid-svg-icons',
            //   '@fortawesome/free-regular-svg-icons',
            // ],
            '@fa/ui': ['@fa/ui'],
            '@fa/icons': ['@fa/icons'],
          },
          // manualChunks(id) {
          //   if (id.includes('node_modules')) {
          //     return id
          //       .toString()
          //       .split('node_modules/')[1]
          //       .split('/')[0]
          //       .toString();
          //   } else if (id.includes('.pnpm')) {
          //     return id
          //       .toString()
          //       .split('node_modules/')[1]
          //       .split('/')[0]
          //       .toString();
          //   }
          // },
          // chunkFileNames: (chunkInfo) => {
          //   const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
          //   const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
          //   return `js/${fileName}/[name].[hash].js`;
          // },
        },
      },
    },
    server: {
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
