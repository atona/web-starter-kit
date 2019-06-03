const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const config = {
  test: /\.(css|scss)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: "css-loader",
      options: {
        url: false,
        sourceMap: true,
        importLoaders: 2
      }
    },
    {
      loader: "postcss-loader",
      options: {
        sourceMap: true,
        // ident: 'postcss',
        // plugins: [
        //   require('tailwindcss'),
        //   require('autoprefixer'),
        // ],
      }
    },
    {
      loader: "sass-loader",
      options: {
        sourceMap: true
      }
    }
  ]
}
module.exports = config;
