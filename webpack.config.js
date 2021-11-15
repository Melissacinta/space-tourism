const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const glob = require('glob');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");


let mode = "development";
let target = "web";
if (process.env.NODE_ENV ==="production") {
    mode = "production";
    target = "browserslist"
}
const PATHS = {
    src: path.join(__dirname, "src"),
}

const plugins =[
    new CleanWebpackPlugin(),
    new PurgecssPlugin({
        paths: glob.sync(`${PATHS.src}/**/*`,{
            nodir:true
        })
    }),
    new MiniCssExtractPlugin({filename:"[name].css"}),
    new HtmlWebpackPlugin({template: "./src/index.html"})
]
module.exports = {
  mode: mode,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    assetModuleFilename: "images/[hash][ext][query]",
    clean: true,
  },
  optimization:{
      splitChunks:{
          cacheGroups:{
              styles:{
                  name: "style",
                  test:/\.css/i,
                  chunks: "all",
                  enforce: true
              }
          }
      }
  },
  module: {
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "",
            },
          },
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  plugins: plugins,
  target: target,
  devtool: "source-map",
  resolve: {
    extentions: [".js", ".jsx"],
  },
  devServer: {
    contentBase: "./public",
    historyApiFallback: true,
    host: "0.0.0.0",
    hot: true,
    open: true,
    port: 3000,
  },
};
