import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import Pages from 'vite-plugin-pages';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log('loadEnv(mode, process.cwd())', loadEnv(mode, process.cwd()));
  return {
    plugins: [
      react(),
      Pages({
        exclude: ['**/components/*.tsx', '**/modal/*.tsx'],
      }),
    ],
    //* css模块化
    css: {
      modules: {
        // css模块化 文件以.module.[css|less|scss]结尾
        // 回调必须返回 `local`，`global`，或者 `pure`
        mode: (resourcePath) => {
          // 形如xx.module.less的样式，会使用local模块化编译。其他的则返回全局样式
          if (/\.module\.(css|less|scss)$/i.test(resourcePath)) {
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
        // { find: /^~/, replacement: '' },
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        // fix less import by: @import ~
      ],
    },
    // server: {
    //   open: true,
    //   proxy: {
    //     '/api': {
    //       target: loadEnv(mode, process.cwd()).VITE_APP_BASE_URL,
    //       changeOrigin: true,
    //     },
    //   },
    // },
  };
});
