const path = require('path');

module.exports = {
  entry: ['./src/ts/Application.tsx', './src/index.htm', './src/index.css'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.htm$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.css$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js?$/,
        enforce: 'pre',
        loader: 'source-map-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
};
