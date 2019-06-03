const path = require("path");
const {
  CheckEsVersionPlugin
} = require("@bitjourney/check-es-version-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlBeautifyPlugin = require("html-beautify-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const globule = require("globule");

// ディレクトリ、その他オプションの設定
const opts = {
  MODE: "production", // production or development
  CHECK_ES5: false,
  BEAUTIFY_HTML: true,
  srcDir: path.join(__dirname, "src"),
  destDir: path.join(__dirname, "public")
};

// keyの拡張子のファイルが、valueの拡張子のファイルに変換される
const convertExtensions = {
  html: "html"
};

// トランスパイルするファイルを列挙する
const files = {};
Object.keys(convertExtensions).forEach(from => {
  const to = convertExtensions[from];
  globule
    .find([
      `**/*.${from}`, 
      // option: 下記をコメントアウトすることで、_から始まるファイルは、他からimportされるためのファイルとして扱い、個別のファイルには出力しない
      // `!**/_*.${from}`
    ], {
      cwd: opts.srcDir
    })
    .forEach(filename => {
      files[
        filename.replace(new RegExp(`.${from}$`, "i"), `.${to}`)
      ] = path.join(opts.srcDir, filename);
    });
});

const htmlWebpackPluginsList = Object.entries(files).map(([key, value]) => {
  return new HtmlWebpackPlugin({
    inject: false,
    filename: key,
    template: value
  });
});

const config = {
  entry: ["@babel/polyfill", `${opts.srcDir}/main.ts`],
  mode: opts.MODE,
  output: {
    path: opts.destDir,
    filename: "assets/js/common.js"
  },
  module: {
    rules: [
      require("./webpack.config.ts.js"),
      require("./webpack.config.css.js")
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".scss"]
  },
  optimization: {
    minimizer: []
  },
  plugins: [
    ...htmlWebpackPluginsList,
    new MiniCssExtractPlugin({
      filename: "assets/css/styles.css"
    }),
    // new CopyWebpackPlugin([
    //   {
    //     from: "src/assets/module",
    //     to: "assets/module",
    //     ignore: ["!_*.html"]
    //   }
    // ]),
    new CopyWebpackPlugin([
      {
        from: "src/assets/fonts",
        to: "assets/fonts"
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: "src/assets/img",
        to: "assets/img"
      }
    ])
  ]
};

if (opts.CHECK_ES5 && opts.MODE === "production") {
  // this plugin works only for production mode,
  // because webpack wraps the input with eval() in development mode.
  config.plugins.push(
    new CheckEsVersionPlugin({
      esVersion: 5
    })
  );
}

if(opts.BEAUTIFY_HTML && opts.MODE === "production") {
  config.plugins.push(
    new HtmlBeautifyPlugin({
      config: {
        html: {
          indent_size: 0
        }
      },
      replace: [' type="text/javascript"']
    })
  );
}

if (opts.MODE === "production") {
  config.optimization.minimizer.push(
    new TerserJSPlugin({
      extractComments: {
        condition: /^\**!|@preserve|@license|@cc_on/i,
        filename: file => {
          return `/LICENSE`;
        },
        banner: licenseFile => {
          return `License information can be found in ${licenseFile}`;
        }
      },
      terserOptions: {
        output: {
          comments: false
        }
      }
    }),
    new OptimizeCSSAssetsPlugin({})
  );
}

module.exports = config;
