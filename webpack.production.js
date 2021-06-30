const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");

const common = require("./webpack.common.js");
const { CONFIG_TYPES } = require("./webpack.common");

const STATIC_URL = "/static";

const production = {
  devtool: "source-map",
  output: {
    publicPath: path.join(STATIC_URL, "components/"),
    assetModuleFilename: "files/[hash][ext][query]",
    devtoolModuleFilenameTemplate: "webpack://[absolute-resource-path]",
  },
  mode: "production",
  plugins: [
    new webpack.EnvironmentPlugin({
      SENTRY_RELEASE: require("child_process")
        .execSync("git rev-parse HEAD")
        .toString()
        .replace("\n", ""),
      SENTRY_ENV: "production",
    }),
  ],
};

const createCompiler = (config) => {
  const compiler = webpack(config);
  return () => {
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) return reject(err);
        console.log(stats.toString({ colors: true }) + "\n");
        compiler.close((closeErr) => {
          if (closeErr) return reject(closeErr);
          resolve();
        });
      });
    });
  };
};

const es5Config = merge.merge(
  {
    plugins: [new CleanWebpackPlugin()],
  },
  common(CONFIG_TYPES.ES5),
  production
);
const es2015Config = merge.merge(common(CONFIG_TYPES.ES2015), production);

(async () => {
  await createCompiler(es5Config)();
  await createCompiler(es2015Config)();
})();
