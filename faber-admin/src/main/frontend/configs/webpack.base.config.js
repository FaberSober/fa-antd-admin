const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

const serverConfig = require('./server.config');

const APP_DIR = path.resolve(__dirname, '../src');
const MONACO_DIR = path.resolve(__dirname, '../node_modules/monaco-editor');
const REACT_PDF_DIR = path.resolve(__dirname, '../node_modules/@react-pdf-viewer');
const REACT_JS_CRON_DIR = path.resolve(__dirname, '../node_modules/react-js-cron');

const devMode = process.env.NODE_ENV !== 'production';
console.log('process.env.NODE_ENV', process.env.NODE_ENV, 'devMode', devMode)

const webpackConfigBase = {
	entry: ['babel-polyfill', './src/main.tsx'],
	output: {
		path: path.resolve(__dirname, '../dist'),
		assetModuleFilename: 'images/[name].[hash:8][ext][query]',
    filename: devMode ? 'js/[name].[hash:8].js' : 'js/[name].[contenthash].js',
    chunkFilename: devMode ? '[name].bundle.[hash:8].js' : '[name].bundle.[contenthash].js',
		publicPath: '/',
		environment: {
			// 是否使用箭头函数
			arrowFunction: false,
		},
	},
  module: {
		rules: [
			{
				test: /\.js[x]?$/,
				exclude: /node_modules/,
				use: [
					'thread-loader',
					'babel-loader',
				],
			},
      {
        test: /\.ts[x]?$/,
        use: [
          'thread-loader',
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              happyPackMode: true,
              context: path.resolve(__dirname, '../'),
              configFile: 'tsconfig.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
			{
				test: /\.css|less$/,
				include: APP_DIR,
				use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader, // 使用mini-css-loader时，不要再使用style-loader
          // {
          //   loader: MiniCssExtractPlugin.loader,
          // },
					{
						loader: 'css-loader',
						options: {
							modules: {
								// 回调必须返回 `local`，`global`，或者 `pure`
								mode: (resourcePath) => {
									// 形如xx.module.less的样式，会使用local模块化编译。其他的则返回全局样式
									if (/\.module\.(css|less)$/i.test(resourcePath)) {
										return "local";
									}
									return "global";
								},
								localIdentName: '[name]__[local]___[hash:base64:5]',
							},
						},
					},
					'postcss-loader',
					{
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  // 修改antd主题色
                  'primary-color': serverConfig.primaryColor,
                  'link-color': serverConfig.linkColor,
                },
                javascriptEnabled: true,
              },
            },
          },
				],
			},
      {
        test: /\.css$/,
        include: [MONACO_DIR, REACT_PDF_DIR, REACT_JS_CRON_DIR],
        use: ['style-loader', 'css-loader'],
      },
			{
        test: /\.(png|jpe?g|gif|svg|ico|eot|ttf|woff|woff2)$/i,
        // More information here https://webpack.js.org/guides/asset-modules/
        type: "asset",
      },
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
      filename: devMode ? '[name].[hash:8].css' : '[name].[contenthash].css',
      chunkFilename: devMode ? '[name].[id].[hash:8].css' : '[name].[contenthash].[id].css',
		}),
		new HtmlWebpackPlugin({ template: 'src/index.html' }),
		new CleanWebpackPlugin(),
    new AntdDayjsWebpackPlugin(), // antd 使用 antd-dayjs-webpack-plugin 插件，无需对现有代码做任何修改直接替换成 Day.js
    // new CopyPlugin({
    //   patterns: [{ from: path.join(__dirname, '../public'), to: path.join(__dirname, '../dist') }],
    // }),
	],
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
		alias: {
	    '@': path.join(__dirname, '../src'),
		},
	},
  target: ['web', 'es5'],
};

module.exports = webpackConfigBase;
