const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const IS_PROD = process.env.NODE_ENV === 'production' ? true : false;
const PUBLIC_PATH = IS_PROD ? '//rphansen91.github.io/redux-rtc' : ''

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname),
        filename: "dist/index.js",
        // libraryTarget: "commonjs",
        library: "ReduxRTC",
        publicPath: PUBLIC_PATH
    },
    plugins: [
        new HtmlWebpackPlugin({ 
            template: 'src/index.html',
            public: PUBLIC_PATH,
            inject: false
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