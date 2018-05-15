const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './client/index.js',
    login: './client/login.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '..', 'static')
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
