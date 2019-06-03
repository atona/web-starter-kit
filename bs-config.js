/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
const ssi = require("./node_modules/browsersync-ssi");

module.exports = {
  // files: "./src/scss/**/*.scss, ./src/img/**/*.png,./src/lib/**/*.js, ./src/**/*.html",
  files: "./public/**/*",
  ghostMode: false,
  server: {
    baseDir: "./public",
    index: "index.html"
  },
  proxy: false,
  port: 3000,
  middleware: ssi({
    baseDir: "./public",
    ext: ".html",
    version: "1.4.0"
  })
};
