const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');


const serverConfig = {
  mode: 'production',
  entry: './src/server/index.ts',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    plugins: [new TsconfigPathsPlugin()]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js'
  }
}


const clientConfig = {
  mode: 'production',
  entry: './src/client/index.ts',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    plugins: [new TsconfigPathsPlugin()]
  },
  output: {
    filename: 'client/main.js',
    path: path.resolve(__dirname, 'dist'),
    // FIXME(zeronineseven): No idea what publicPath actually does but koa-webpack does not work otherwise.
    publicPath: "/",
  },
};

module.exports = [serverConfig, clientConfig];
