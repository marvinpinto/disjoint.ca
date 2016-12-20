var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var webpack = require('webpack');

module.exports = {
  name: 'assets',
  entry: {
    app: ['./tmp/js/google-analytics.js', './assets/js/main.js']
  },

  output: {
    filename: '[name]-[hash].min.js',
    libraryTarget: 'var',
    library: 'EntryPoint'
  },

  devtool: process.env.HUGO_ENV === 'production' ? "source-map" : "eval-source-map",

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },

      {test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader!css-loader!sass-loader', "css!resolve-url!sass?sourceMap")},
      {test: /\.woff$/, loader: 'file-loader?limit=65000&mimetype=application/font-woff&name=[name]-[hash].[ext]'},
      {test: /\.woff2$/, loader: 'file-loader?limit=65000&mimetype=application/font-woff2&name=[name]-[hash].[ext]'},
      {test: /\.svg$/, loader: 'file-loader?limit=65000&mimetype=image/svg+xml&name=[name]-[hash].[ext]'},
      {test: /\.[ot]tf$/, loader: 'file-loader?limit=65000&mimetype=application/octet-stream&name=[name]-[hash].[ext]'},
      {test: /\.eot$/, loader: 'file-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=[name]-[hash].[ext]'},
      {test: /\.json$/, loader: 'json'},

      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[name]-[hash].[ext]',
          'image-webpack'
        ]
      }
    ]
  },

  imageWebpackLoader: {
    optimizationLevel: 7,
    interlaced: false
  },

  plugins: [
    new ExtractTextPlugin('[name]-[hash].min.css', {allChunks: true}),
    new ManifestPlugin({
      fileName: 'assets.json',
      publicPath: 'assets/'
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ],

  devServer: {
    historyApiFallback: true
  }
};
