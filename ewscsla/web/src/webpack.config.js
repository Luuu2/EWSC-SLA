const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const {SourceMapDevToolPlugin} = require("webpack");
const path = require('path');

module.exports = {
    entry: './app/main.tsx',  // path to our input file, main file
    output: {
        // clean: true, // todo move to its own output folder
        filename: '[name].bundle.js',  // output bundle file name
        path: path.resolve(__dirname, '../static/web/dist'),  // path to our Django static directory
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'static/images/'
                }
            },
            {
                test: /\.(ttf|eot|svg|gif|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [{
                    loader: 'file-loader',
                }]
            },
        ],
    },
    resolve: {
        extensions: ['', '.js', '.tsx', '.ts', '.css'],
        alias: {
            "@/components": path.resolve(__dirname, "components/"),
            "@/app": path.resolve(__dirname, "app/"),
            "@/lib": path.resolve(__dirname, "lib/"),
            "@/pages": path.resolve(__dirname, "pages/"),
            "@/store": path.resolve(__dirname, "store/"),
            "@/routes": path.resolve(__dirname, "routes/"),
            "@/layouts": path.resolve(__dirname, "layouts/"),
        },
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new SourceMapDevToolPlugin({
            filename: "[file].map"
        })
    ],
    optimization: {
        minimizer: [
            new CssMinimizerPlugin()
        ]
    },
};