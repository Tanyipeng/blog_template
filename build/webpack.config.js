const path = require('path');
const {
  RootPath,
  StaticPath,
  SourcePath,
  DistPath
} = require('./path.config');
// 插件
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default;

module.exports = {
  entry: path.join(SourcePath, 'main.js'),
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.js', '.vue', '.json', '.css', '.scss', '.less'],
    alias: {
      "@": SourcePath
    }
  },
  module: {
    rules: [{
        test: /\.vue$/,
        use: 'vue-loader'
      }, {
        test: /\.(scss|sass)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.js$/,
        include: SourcePath,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-proposal-decorators', {
                legacy: true
              }],
              ['@babel/plugin-proposal-class-properties', {
                loose: true
              }],
              '@babel/plugin-transform-runtime',
              '@babel/plugin-syntax-dynamic-import',
              'transform-vue-jsx'
            ]
          }
        }
      },
      {
        test: /\.js$/,
        enforce: 'pre', // 该loader第一个用来解析
        include: SourcePath,
        use: {
          loader: 'eslint-loader',
          options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
            formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
          }
        }
      },
      {
        test: /\.(html|htm)$/,
        use: 'html-withimg-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      mode: JSON.stringify(process.env.NODE_ENV)
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['*/*', '!*/dll']
    }),
    new CopyWebpackPlugin([{
      from: StaticPath,
      to: DistPath + '/static'
    }]),
    new webpack.DllReferencePlugin({
      manifest: path.resolve('dist', 'js', 'dll', 'vue.manifest.json')
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve('dist', 'js', 'dll', 'element_ui.manifest.json')
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve('dist', 'js', 'dll', 'polyfill.manifest.json')
    }),
    new WebpackDeepScopeAnalysisPlugin()
  ]
}
