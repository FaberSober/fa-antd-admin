import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import Pages from 'vite-plugin-pages'
// import VitePluginImp from "vite-plugin-imp";
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log('loadEnv(mode, process.cwd())', env)
  return {
    plugins: [
      react(),
      Pages({
        exclude: ['**/components/*.tsx', '**/modal/*.tsx', '**/cube/*.tsx', '**/drawer/*.tsx', '**/helper/*.tsx'],
        importMode: 'sync',
      }),
      // 按需导入
      // https://github.com/onebay/vite-plugin-imp
      // VitePluginImp({
      //   libList: [
      //     {
      //       libName: "antd",
      //       // 不写 libList,默认是按需导入css,
      //       // 想要使用 less, 需要改为加载 es 的 index.js,
      //       // 里面加载了组件所需的一些 less 文件
      //       style: (name) => `antd/es/${name}/style/index.js`,
      //     },
      //   ],
      // }),
    ],
    //* css模块化
    css: {
      modules: { // css模块化 文件以.module.[css|less|scss]结尾
        // 回调必须返回 `local`，`global`，或者 `pure`
        mode: (resourcePath) => {
          // 形如xx.module.less的样式，会使用local模块化编译。其他的则返回全局样式
          if (/\.module\.(css|less)$/i.test(resourcePath)) {
            return "local";
          }
          return "global";
        },
        generateScopedName: '[name]__[local]___[hash:base64:5]',
        hashPrefix: 'prefix',
      },
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true,
          // 重写 less 变量，定制样式
          modifyVars: {
            // 修改antd主题色
            '@primary-color': env.VITE_APP_STYLE_PRIMARY_COLOR,
            'link-color': env.VITE_APP_STYLE_LINK_COLOR,
          },
        },
      },
    },
    resolve: {
      alias: [
        { find: /^~@/, replacement: path.resolve(__dirname, 'src') },
        // { find: /^~/, replacement: '' },
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        // fix less import by: @import ~
        // less import no support webpack alias '~' · Issue #2185 · vitejs/vite
        { find: /^~antd/, replacement: "antd" },
      ],
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
  }
})
