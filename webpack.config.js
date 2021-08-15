const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const path = require('path');

let tailwindcss = require('tailwindcss')
let autoprefixer = require('autoprefixer')

const config = {
  entry: './src/index.tsx',
  devtool: 'eval-source-map',
  devServer: {
    port: 4422,
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      { 
        test: /\.(ts|tsx)?$/, 
        loader: "ts-loader",
        options: {
          silent: true,
        }
       },
      { test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                tailwindcss,
                autoprefixer,
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
          },
        }],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: './src/index.html',
      appMountId: 'app',
      links: [
        {
          href: '/src/index.css',
          rel: 'stylesheet',
        },
      ],
    }),
  ],
};

module.exports = config;
