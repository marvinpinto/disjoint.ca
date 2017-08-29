var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var PurifyCSSPlugin = require('purifycss-webpack');
var _ = require('lodash');
var glob = require('glob');
var path = require('path');

const getPlugins = () => {
  var plugins = [];

  plugins.push(new webpack.optimize.ModuleConcatenationPlugin());

  plugins.push(new ExtractTextPlugin({
    filename: process.env.NODE_ENV === 'production' ? '[name]-[hash].css' : '[name].css',
    allChunks: true,
  }));

  plugins.push(new UglifyJSPlugin({
    parallel: true,
    sourceMap: true,
    uglifyOptions: {
      ie8: false,
      ecma: 5,
      mangle: true,
      compress: {
        warnings: false,
        drop_console: true,
        drop_debugger: true,
        dead_code: true,
        passes: 10,
        reduce_vars: true,
        collapse_vars: true,
        if_return: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        properties: true,
      },
    },
    extractComments: false,
  }));

  plugins.push(new PurifyCSSPlugin({
    paths: _.flattenDeep([
      glob.sync(path.join(__dirname, 'assets/js/*.js')),
      glob.sync(path.join(__dirname, 'content/*.*')),
      glob.sync(path.join(__dirname, 'themes/custom/**/*.*')),
      glob.sync(path.join(__dirname, 'node_modules/bootstrap/js/src/*.*')),
    ]),
    minimize: true,
    purifyOptions: {
      // whitelist: [
      //   'highlight',
      //   'code',
      //   'kbd',
      //   'pre',
      //   'samp',
      //   'docs-single-page-answer',
      // ],
    },
  }));

  plugins.push(new ManifestPlugin({
    fileName: '../data/assets.json',
  }));

  plugins.push(new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    jquery: 'jquery',
  }));

  return plugins;
};

module.exports = {
  name: 'assets',
  entry: {
    app: [
      './tmp/js/google-analytics.js',
      './assets/js/main.js'
    ]
  },

  output: {
    filename: process.env.HUGO_ENV === 'production' ? '[name]-[chunkhash].js' : '[name].js',
    libraryTarget: 'var',
    library: 'EntryPoint'
  },

  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                'stage-2',
                [
                  'env',
                  {
                    targets: {
                      browsers: [
                        'Last 2 Chrome versions',
                        'Last 2 Firefox versions',
                        'Last 2 Edge versions',
                        'Last 1 iOS version',
                        'Last 1 Safari version',
                      ],
                      uglify: process.env.HUGO_ENV === 'production',
                    },
                    debug: process.env.HUGO_ENV === 'production',
                  },
                ],
              ],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {loader: 'css-loader', options: {sourceMap: true}},
            {loader: 'sass-loader', options: {sourceMap: true}},
          ],
        }),
      },
      {
        test: /\.woff$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: '65000',
              mimetype: 'application/font-woff',
              name: '[name]-[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.woff2$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: '65000',
              mimetype: 'application/font-woff2',
              name: '[name]-[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: '65000',
              mimetype: 'image/svg+xml',
              name: '[name]-[hash].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            query: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.[ot]tf$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: '65000',
              mimetype: 'application/octet-stream',
              name: '[name]-[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.eot$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: '65000',
              mimetype: 'application/vnd.ms-fontobject',
              name: '[name]-[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[hash].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            query: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
    ],
  },

  plugins: getPlugins()
};
