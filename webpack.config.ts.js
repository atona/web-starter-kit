const config = {
  test: /\.ts?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"]
      }
    },
    { loader: "ts-loader" }
  ]
}
module.exports = config;