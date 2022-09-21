const path = require('path');
const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');

const webpackConfigBase = require('./webpack.base.config');
const { DEV_SERVER } = require('./server.config.js');

console.log('[development]process.env.NODE_ENV :>> ', process.env.NODE_ENV);

module.exports = merge(webpackConfigBase, {
  mode: 'development',
  devServer: {
		open: false,
		port: 8888,
		compress: true,
		hot: true,
    historyApiFallback: true,
    // 代理服务器，开发时避免跨域访问
    proxy: {
      '/api': {
        target: DEV_SERVER,
        changeOrigin: true,
      },
      '/file': {
        target: DEV_SERVER,
        changeOrigin: true,
      },
    },
  },
  // 监控的选项
  watchOptions: {
    poll: 1000, // 每秒检查一次变动
    aggregateTimeout: 600, // 防抖 我一直输入代码
    ignored: /node_modules/, // 不需要进行监控哪个文件
  },
  /**
   * 增加映射文件，帮我们调试源代码
   *
   * https://webpack.js.org/configuration/devtool/#devtool
   *
   * (1) eval：以 eval 形式注入业务代码，可能会有些报错信息丢失
   * (2) cheap：报错不会显示列信息，只会显示行信息
   * (3) module：还会生成一些第三方库的 map 文件，方便调试
   *
   * 1.source-map: 产生单独的 soursemap 文件，出错会标识出错的列和行
   * 2.eval-source-map: 不产生单独的文件, 增加映射文件，帮我们调试源代码
   * 3.cheap-module-source-map: 不会产生列，但是一个单独的文件, 产生后可以保存起来（用的不多，可以在线上用【解决线上 bug】）
   * 4.eval-cheap-module-source-map: 不会长生文件，集成在打包后的文件末尾，不会产生列提示（调试模式推荐）
   *
   */
  devtool: 'eval-source-map',

  plugins: [
    new CopyPlugin({
      patterns: [{ from: path.join(__dirname, '../public'), to: path.join(__dirname, '../dist') }],
    }),
  ],
});
