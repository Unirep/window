const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  entry: './worker/index.js',
  // use production to avoid eval()
  mode: 'production',
  target: 'webworker',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: '/',
  },
  resolve: {
    alias: {
      react: require.resolve('react'),
      mobx: require.resolve('mobx'),
      'mobx-react-lite': require.resolve('mobx-react-lite'),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          // publicPath: 'build',
          esModule: false,
        }
      },
      {
        test: /\.css$/,
        // exclude: /node_modules/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        }, 'css-loader',]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
  ],
  optimization: {
    minimizer: [
      `...`,
      new CssMinimizerPlugin(),
    ],
  },
}
