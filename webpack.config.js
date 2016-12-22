var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var webpack = require('webpack');

function getPlugins() {
  var plugins = [];

  plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: !(process.env.HUGO_ENV === 'production'),
      drop_console: process.env.HUGO_ENV === 'production',  // eslint-disable-line camelcase
      dead_code: true,  // eslint-disable-line camelcase
      passes: 10
    }
  }));

  plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
  }));

  plugins.push(new ExtractTextPlugin({filename: '[name]-[hash].min.css', allChunks: true, disable: false}));

  plugins.push(new ManifestPlugin({
    fileName: 'assets.json',
    publicPath: 'assets/'
  }));

  plugins.push(new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  }));

  return plugins;
}

module.exports = {
  name: 'assets',
  entry: {
    app: [
      './tmp/js/google-analytics.js',
      './assets/js/main.js'
    ]
  },

  output: {
    filename: '[name]-[hash].min.js',
    libraryTarget: 'var',
    library: 'EntryPoint'
  },

  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },

      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader!css-loader!sass-loader',
          loader: 'css-loader!resolve-url-loader!sass-loader'
        })
      },

      {test: /\.woff$/, loader: 'file-loader?limit=65000&mimetype=application/font-woff&name=[name]-[hash].[ext]'},
      {test: /\.woff2$/, loader: 'file-loader?limit=65000&mimetype=application/font-woff2&name=[name]-[hash].[ext]'},
      {test: /\.svg$/, loader: 'file-loader?limit=65000&mimetype=image/svg+xml&name=[name]-[hash].[ext]'},
      {test: /\.[ot]tf$/, loader: 'file-loader?limit=65000&mimetype=application/octet-stream&name=[name]-[hash].[ext]'},
      {test: /\.eot$/, loader: 'file-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=[name]-[hash].[ext]'},
      {test: /\.json$/, loader: 'json-loader'},

      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha256',
              digest: 'hex',
              name: '[name]-[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            query: {
              optimizationLevel: 7,
              interlaced: false,
            }
          }
        ]
      }
    ]
  },

  plugins: getPlugins()
};
