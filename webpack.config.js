const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './client/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env', '@babel/preset-react'
              ],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'client'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: ['file-loader']
      },
      {
        test: /\.(mov|mp4)$/,
        use: [
          {
            loader: 'file-loader',
            // options: {
            //   name: 'deep_sea.mp4',
            //   name2: 'office_walkers.mp4'
            // }  
          }
        ]
      },    
    ],
  }, 
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'build'),
      publicPath: '/build',
    },
    historyApiFallback: true,
    port: 8080,
    proxy:[
      {
        context: ['/'],
        target: 'http://localhost:3000'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: '/client/index.html',
    }),
  ]
};

