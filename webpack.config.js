var webpack = require('webpack'),
    CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
    entry: {
        app: './application/main.ts',
        polyfills: "./application/polyfills.ts",
        vendors: "./application/vendors.ts"
    },
    //devtool: 'inline-source-map',
    output: {
        path: __dirname,
        filename: './build/debug/[name].js',
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']

            },
            {
                test: /\.(html|css)$/,
                loaders: ['raw-loader']
            }
        ]
    },

    plugins: [
        new webpack.NoErrorsPlugin(),
        new CommonsChunkPlugin({
            name: ['app', 'vendors', 'polyfills'],
            minChunks: 2
        })
    ]
};