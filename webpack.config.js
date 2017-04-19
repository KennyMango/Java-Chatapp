/**
 * Created by Kenneth on 2017-04-10.
 */
const webpack = require("webpack");
const path = require("path");

var jF = path.resolve(__dirname, "js");
var bF = path.resolve(__dirname, "build");

var config = {
    entry: {
        "main":jF+"/main.js",
        "post":jF+"/post.js",
        "room":jF+"/room.js"
    },
    output:{
        filename:"[name]bundle.js",
        path:bF
    },
    plugins:[
        new webpack.ProvidePlugin({
            $:"jquery",
            jQuery:"jquery"
        })
    ]
};

module.exports = config;