const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const env = process.env.WEBPACK_ENV || 'development'

// Simply configure those 4 variables:
const JS_SOURCE_FILES = ['babel-polyfill', './src/index.js']
const OUTPUT_FILENAME = 'index'
const DEST_FOLDER = 'dist'
const COPYRIGHT = `Add your copyright here. It is included at the beginning of your bundle.`

const OUTPUT_FILE = `${OUTPUT_FILENAME}.js`
const OUTPUT_FILE_MIN = `${OUTPUT_FILENAME}.min.js`

const { plugins, outputfile, mode } = env == 'build' 
	? { 
		plugins: [
			new UglifyJSPlugin(), 
			new webpack.BannerPlugin(COPYRIGHT)
		], 
		outputfile: OUTPUT_FILE_MIN,
		mode: 'production'
	} 
	: { 
		plugins: [
			new webpack.BannerPlugin(COPYRIGHT)
		], 
		outputfile: OUTPUT_FILE,
		mode: 'development'
	} 

module.exports = {
	mode,
	entry: JS_SOURCE_FILES,
	output: {
		path: path.join(__dirname, DEST_FOLDER),
		filename: outputfile,
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	module: {
		rules: [{
			// Only run `.js` files through Babel
			test: /\.m?js$/,
			exclude: /(node_modules)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
			}
		}]
	},
	devtool: 'source-map',
	plugins: plugins
}