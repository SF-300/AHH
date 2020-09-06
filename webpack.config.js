const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');


module.exports = {
  mode: 'production',
  entry: './src/client/index.ts',
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
    plugins: [
        new TsconfigPathsPlugin()
    ]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    // FIXME(zeronineseven): No idea what publicPath actually does but koa-webpack does not work otherwise.
    publicPath: "/",
  },
};
