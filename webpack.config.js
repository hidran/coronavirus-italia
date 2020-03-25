const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const env = process.env.WEBPACK_ENV || 'development'

// Simply configure those 4 variables:
const JS_SOURCE_FILES = ['babel-polyfill', './src/index.js']
const OUTPUT_FILENAME = '[name].[hash].bundle';
const DEST_FOLDER = 'dist'
const COPYRIGHT = `Add your copyright here. It is included at the beginning of your bundle.`

const OUTPUT_FILE = `${OUTPUT_FILENAME}.js`
const OUTPUT_FILE_MIN = `${OUTPUT_FILENAME}.min.js`
const htmlsources = [
    {from: 'css', to: 'css'},
    {from: 'images', to: 'images'},
    {from: 'index.html', to: 'index.html'},
];
const htmlplugconfig = {

        inject: 'head',
    viewport:'width=device-width, initial-scale=1, shrink-to-fit=no',

template: 'index.html'
}
;
const {plugins, outputfile, mode} = env == 'build'
    ? {
        plugins: [
            new UglifyJSPlugin(),

            new HtmlWebpackPlugin(htmlplugconfig),
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: 'async'
            }),

            new MiniCssExtractPlugin({filename:OUTPUT_FILENAME +'.css'}),
            new CleanWebpackPlugin()
        ],
        outputfile: OUTPUT_FILE_MIN,
        mode: 'production'
    }
    : {
        plugins: [
            new HtmlWebpackPlugin(htmlplugconfig),
            new ScriptExtHtmlWebpackPlugin({
                    defaultAttribute: 'async'
                }
            ),

            new MiniCssExtractPlugin({filename:OUTPUT_FILENAME +'.css'}),
            new CleanWebpackPlugin()
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
        umdNamedDefine: true,
        chunkFilename: '[id].js'
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
        },

            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            }
        ]
    },
    devtool: 'source-map',
    plugins: plugins
}
