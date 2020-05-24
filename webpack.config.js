const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const WebpackMd5Hash = require("webpack-md5-hash");

const path = require("path");
const webpack = require("webpack");

const development = process.env.NODE_ENV === "development";

const config = {
	mode: process.env.NODE_ENV,
	context: path.resolve(__dirname, "app"),
	entry: {
		app: [
			"babel-polyfill",
			path.resolve(__dirname, "app", "main.js"),
			path.resolve(__dirname, "app", "main.scss")
		]
	},
	output: {
		chunkFilename: development ? "[id].js" : "[id].[chunkhash].js",
		filename: development ? "app.js" : "app.[chunkhash].js",
		path: path.resolve(__dirname, "build"),
		publicPath: "/"
	},
	resolve: {
		alias: { vue$: "vue/dist/vue.esm.js" },
		extensions: [".js", ".vue"]
	},
	module: {
		rules: [{
			test: /\.vue$/,
			loader: "vue-loader"
		}, {
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: {
				loader: "babel-loader",
				options: {
					presets: ["@babel/preset-env"],
					plugins: ["syntax-dynamic-import"],
					comments: false
				}
			}
		}, {
			test: /\.css$/,
			use: ["style-loader", "css-loader"]
		}, {
			test: /\.scss$/,
			include: [
				/node_modules/,
				path.resolve(__dirname, "app")
			],
			use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
		}, {
			test: /\.(woff|woff2|eot|ttf|otf|png|svg|jpe?g|gif)$/,
			loader: "file-loader",
			options: {
				esModule: false,
				name: development ? "[path][name].[ext]" : "[hash].[ext]"
			}
		}]
	},
	plugins: [
		new FaviconsWebpackPlugin({
			logo: path.resolve(__dirname, "app", "assets", "favicon.png"),
			emitStats: false,
			inject: true
		}),
		new HtmlWebpackPlugin({
			filename: "app.html",
			template: path.resolve(__dirname, "app", "index.html")
		}),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: `"${process.env.NODE_ENV}"`
			}
		}),
		new MiniCssExtractPlugin({
			chunkFilename: development ? "[id].css" : "[id].[chunkhash].css",
			filename: development ? "app.css" : "app.[chunkhash].css"
		}),
		new VueLoaderPlugin()
	],
	optimization: {
		minimizer: development ? [] : [new UglifyJsPlugin()]
	}
};

if(!development) {
	config.plugins.push(new WebpackMd5Hash());
}

module.exports = config;
