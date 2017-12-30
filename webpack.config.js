const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './client/index.js',
    login: './client/login.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'static')
  },
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
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
    }),
  ]
};
