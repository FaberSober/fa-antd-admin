const path = require('path');
const { merge } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const webpackConfigBase = require('./webpack.base.config');

console.log('[production]process.env.NODE_ENV :>> ', process.env.NODE_ENV);

module.exports = merge(webpackConfigBase, {
  mode: "production",
  devtool: 'cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
  },
  optimization: {
    // 代码压缩
    minimize: true,
    minimizer: [new TerserPlugin()],
    // 优化选项（非必选）
    usedExports: true,
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      chunks: 'all', // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
      minSize: 30000, // 模块超过30k自动被抽离成公共模块
      minChunks: 1, // 模块被引用>=1次，便分割
      name: 'vendors', // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function
      automaticNameDelimiter: '~', // 命名分隔符
      cacheGroups: {
        default: {
          // 模块缓存规则，设置为false，默认缓存组将禁用
          minChunks: 2, // 模块被引用>=2次，拆分至vendors公共模块
          priority: -20, // 优先级
          reuseExistingChunk: true, // 默认使用已有的模块
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: -10, // 确定模块打入的优先级
          reuseExistingChunk: true, // 使用复用已经存在的模块
          enforce: true,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 10, // 需要级别高点
        },
        polyfill: {
          test: /[\\/]node_modules[\\/](babel-polyfill|core-js)[\\/]/,
          name: 'polyfill',
          chunks: 'all',
          priority: 10, // 需要级别高点
        },
        router: {
          test: /[\\/]node_modules[\\/](@reach)[\\/]/,
          name: 'router',
          chunks: 'all',
          priority: 10, // 需要级别高点
        },
        antd: {
          test: /[\\/]node_modules[\\/](antd)[\\/]/,
          name: 'antd',
          chunks: 'all',
          priority: 10, // 需要级别高点
        },
      },
    },
  },
  plugins: [
    // 分析代码
    new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    new CopyPlugin({
      patterns: [{ from: path.join(__dirname, '../public'), to: path.resolve(__dirname, '../dist') }],
    }),
  ],
});
