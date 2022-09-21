module.exports = function (env, argv) {
    return argv.mode === 'production' ? require('./configs/webpack.prod.config.js') : require('./configs/webpack.dev.config.js');
  };
  