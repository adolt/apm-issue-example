const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const paths = {
  src: path.resolve(__dirname, 'src'),
  html: path.resolve(__dirname, 'public/index.html'),
  js: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'build'),
}

const publicPath = '/'

const common = {
  entry: {
    app: paths.js,
  },
  output: {
    path: paths.dist,
  },
  resolve: {
    alias: {
      src: paths.src,
    },
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.vue'],
    symlinks: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: paths.html,
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeAttributeQuotes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      },
    }),
    new CopyWebpackPlugin([
      {
        from: 'public/**/*',
        to: 'static/media',
        ignore: ['*.html'],
        flatten: true,
      },
    ]),
  ],
}

const production = {
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [paths.js, /@elastic/],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([paths.dist]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module =>
        module.context && module.context.includes('node_modules'),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      children: true,
      async: 'common',
      minChunks: module =>
        module.context && module.context.includes('node_modules'),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new InlineManifestWebpackPlugin(),
    new InterpolateHtmlPlugin({
      PUBLIC_URL: `${publicPath}static/media`,
    }),
  ],
  stats: {
    children: false,
    chunks: false,
    chunkModules: false,
    modules: false,
  },
}

module.exports = env => merge(common, production)
