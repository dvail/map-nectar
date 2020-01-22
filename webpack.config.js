const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const path = require('path');

let tailwindcss = require('tailwindcss')
let autoprefixer = require('autoprefixer')
let purgecss = require('@fullhuman/postcss-purgecss')

const config = {
  entry: './src/index.js',
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
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
                ...process.env.NODE_ENV !== 'development'
                  ? [purgecss({
                    content: [
                      './src/index.html',
                      './src/**/*.jsx',
                    ],
                    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
                  })]
                  : [],
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
    extensions: ['.js'],
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
