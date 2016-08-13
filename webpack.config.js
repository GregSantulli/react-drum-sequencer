var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack');
module.exports = {
    entry: [
      'webpack/hot/only-dev-server',
      "./js/app.js"
    ],
    output: {
        path: __dirname + '/build',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {test : /\.jsx?/, exclude: /node_modules/, loader: 'babel'},
            { test: /\.js?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/, presets: ['es2015', 'react'] },
            { test: /\.css$/, loader: "style!css" },
            { test: /\.sass$/, loaders: ["style", "css", "sass"]},
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }
        ]
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ]

};