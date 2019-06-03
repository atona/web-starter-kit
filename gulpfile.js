const async = require("async");
const gulp = require("gulp");
const svgSprite = require("gulp-svg-sprite");
const iconfont = require("gulp-iconfont");
const consolidate = require("gulp-consolidate");

const SRC = "./src";
// const DIST = "./public";

// svgスプライト
gulp.task("svg-sprite", function(done) {
  gulp
    .src(SRC + "/assets/svg/**/*.svg")
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: ".", // 出力場所
            sprite: "sprite.svg" // ファイル名
          }
        },
        shape: {
          transform: [
            {
              svgo: {
                // svgのスタイルのオプション
                plugins: [
                  { removeTitle: true } // titleを削除
                  // { 'removeStyleElement': true }, // <style>を削除
                  // { 'removeAttrs': { 'attrs': 'fill' } } // fill属性を削除
                ]
              }
            }
          ]
        },
        // 出力する際のオプション
        svg: {
          xmlDeclaration: true, // xml宣言をつける
          doctypeDeclaration: true // doctype宣言をつける
        }
      })
    )
    .pipe(gulp.dest(SRC + "/assets/img/common"));
  done();
});

// アイコンフォント
const runTimestamp = Math.round(Date.now() / 1000);
gulp.task("icon-font", function(done) {
  const iconStream = gulp.src(["src/assets/icons/*.svg"]).pipe(
    iconfont({
      fontName: "myfont",
      // fixedWidth: true,
      // centerHorizontally: true
      normalize: true
    })
  );

  async.parallel(
    [
      function handleGlyphs(cb) {
        iconStream.on("glyphs", function(glyphs) {
          gulp
            .src("src/assets/icons/templates/_myfont.scss")
            .pipe(
              consolidate("lodash", {
                glyphs: glyphs,
                fontName: "myfont",
                fontPath: "../fonts/",
                className: "icf",
                cacheBuster: runTimestamp
              })
            )
            .pipe(gulp.dest("src/scss/"))
            .on("finish", cb);
        });
      },
      function handleFonts(cb) {
        iconStream.pipe(gulp.dest("src/assets/fonts/")).on("finish", cb);
      }
    ],
    done
  );
});
