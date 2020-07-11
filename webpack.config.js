const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public'),
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }],
    },
    devServer: {
        contentBase: './public',
        port:5500,
        historyApiFallback:{
            index:'index.html'
        }
    },
};