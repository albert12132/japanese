const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
  devtool: 'eval-source-map',
  devServer: {
    contentBase: './static/',
    proxy: {
      '/': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/auth': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/api': {
        target: 'http://localhost:3000',
        secure: false
      }
    }
  },
});
