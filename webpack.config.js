const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const IS_PROD = process.env.NODE_ENV === 'production' ? true : false;
const IS_DEMO = process.env.IS_DEMO === 'demo' ? true : false;

const PUBLIC_PATH = (IS_PROD) ? '//rphansen91.github.io/redux-rtc' : ''

const config = {
    entry: IS_DEMO ? "./src/demo.js" : "./src/index.js",
    output: {
        path: path.resolve(__dirname),
        filename: "main.js",
        libraryTarget: "commonjs",
        publicPath: PUBLIC_PATH
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.IS_DEMO': JSON.stringify(process.env.IS_DEMO),
            'process.env.TEST': process.env.TEST
        })
    ],
    module: {
        loaders: [
            {   
                test: /\.js$/, 
                loader: "babel-loader", 
                query: {
                    presets: ["env"]
                },
                exclude: /(node_modules|bower_components)/ 
            }
        ]
    }
};

if (IS_DEMO) {
    config.output = {
        path: path.resolve(__dirname),
        filename: "demo.js",
        publicPath: PUBLIC_PATH
    }
    config.plugins.push(new HtmlWebpackPlugin({ 
        template: 'src/index.html',
        public: PUBLIC_PATH,
        inject: false
    }))
}

module.exports = config;