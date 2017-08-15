'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

let config = {
	entry: ['babel-polyfill', './src/js/entry'],

	output: {
		filename: './build/script.js'
	},

	devtool: 'cheap-source-map',
    module: {
	    loaders: [
		    {
				test: /\.jsx?$/,
				exclude: [/node_modules/],
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'stage-0', 'stage-1', 'react']
				}
			}
		]
	}
};

module.exports = (buildDirectory) => {
	config.output.filename = `./${buildDirectory}/script.js`;

	return config;
}