'use strict';

const NODE_ENV = process.env.NODE_ENV || 'DEVELOPMENT';
const webpack = require('webpack');

let config = {
	entry: ['babel-polyfill', './src/js/entry'],

	output: {
		filename: './build/script.js' // will be redefined below
	},

	devtool: NODE_ENV === 'DEVELOPMENT' && 'source-map', // will be redefined below
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

module.exports = (buildDirectory, node_env = NODE_ENV) => {
	config.output.filename = `./${buildDirectory}/script.js`;
	config.devtool = (node_env === 'DEVELOPMENT') && 'source-map';

	return config;
}