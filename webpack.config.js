const path = require('path');
const JSName = process.env.JSName || 'main'

console.log(`JSName:${JSName}`);

module.exports = [{
  entry: {
    app: [`./lib/${JSName}.js`],
  },
  mode: "development",
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: "./public",
    inline: true,
    port: 3006
  },
  module: {
    rules: [{
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
}];