// const tailwindcss = require("tailwindcss");
// const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [
    // tailwindcss("./tailwind.js"),
    require('postcss-import'),
    require('tailwindcss'),
    require("autoprefixer")({
      grid: true
    })
  ]
};
