const path = require('path');
const webpack = require('webpack');

const PATHS = {
	app: './client/src/index.js',
	dist: path.join(__dirname, 'client', 'dist'),
};
module.exports = {
  entry: [
    './client/src/index.js'
  ],
  output: {
    path: PATHS.dist,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-0']
      }
    },
      {
         test: /\.scss?$/,
         loader: 'style!css!sass',
         include: path.join(__dirname, 'src', 'css')
       }
    ]
  },
  watch: true,
  devTool: 'source-map',
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    inline: true
  }
};
