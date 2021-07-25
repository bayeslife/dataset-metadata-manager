require('dotenv').config()
const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const EnvironmentWebpackPlugin = require("webpack/lib/EnvironmentPlugin");
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

const APPFRAME_DOMAIN = process.env.APPFRAME_DOMAIN || "https://localhost:3007"
const STYLE_DOMAIN = process.env.STYLE_DOMAIN || "https://localhost:3011"

const deps = require('./package.json').dependencies

module.exports = (env) => {
  return {
    entry: './src/index',
    cache: false,

    mode: 'development',
    devtool: 'source-map',

    optimization: {
      minimize: false,
    },
    devServer: {
      port: 3005,
      https: {
        key: env.BUILD==='CI' ? 'notused' : fs.readFileSync('./key.pem'),
        cert: env.BUILD==='CI' ? 'notused' : fs.readFileSync('./cert.pem'),
      },
    },

    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.scss', '.css', '.sass', '.svg', '.png'],
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: 'css-loader',
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.m?js/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.jsx?$/,
          loader: require.resolve('babel-loader'),
          options: {
            presets: [require.resolve('@babel/preset-react')],
          },
        },
        {
          test: /\.md$/,
          loader: 'raw-loader',
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          loader: 'file-loader',
          options: {
            publicPath: 'images',
            outputPath: 'images',
          },
        },
      ],
    },

    plugins: [
      new EnvironmentWebpackPlugin(['API_DOMAIN']),
      new ModuleFederationPlugin({
        name: 'ApplicationProjects',
        filename: 'remoteEntry.js',
        remotes: {
          ApplicationFrameRemote: `ApplicationFrame@${APPFRAME_DOMAIN}/remoteEntry.js`,                
          StyleManagementRemote: `StyleManagement@${STYLE_DOMAIN}/remoteEntry.js`,        
        },
        exposes: {          
          "./ProjectFactory": "./src/shared/ProjectFactory.shared",          
        },
        shared: {
          ...deps,
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: deps['react-dom'],
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
  }
}