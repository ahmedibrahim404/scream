const path = require('path');

module.exports = {
    mode:'development',
    devtool:"inline-source-map",
    entry:'./assets/javascripts/main.js',
    watch: true,
    output: {
        path: path.resolve(__dirname, 'files/javascripts'),
        filename: 'bundle.js'

    },
    devServer : {
        inline : true,
        port : 3333
    },
    module:{
        rules: [
            {
                test:/\.js/,
                exclude: /node_modules/,
                loader:"babel-loader",
            },
            {
                test:/\.s?css/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    } 
}