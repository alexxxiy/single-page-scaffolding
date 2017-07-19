const fs           = require('fs');
const colors       = require('colors');
const log          = require('./logger')(module);
var libConf        = require('../lib.conf.json');
var libTypes       = Object.keys(libConf);


exports.libTypes   = libTypes;

exports.resetCache = function(done){
	delete require.cache[require.resolve('../lib.conf.json')];
	libConf = require('../lib.conf.json');

	libTypes = Object.keys(libConf);
	done();

};

exports.getAllLibrariesFileNames = function(returnFilePath=false){
	var result = libTypes.reduce(function(res, type){
		return res.concat(exports.getLibrariesFileNamesByType(type, true));
	}, []);

	return result;
};

exports.getLibrariesFileNamesByType = function(type, returnFilePath=false){
	var libs = libConf[type];
	var libFiles = [];
	var file, files, path;

	if(!libs){
		console.log(`ERROR!!! No libraries with type "${type}"`);
		return libFiles;
	}

	for(var name in libs){
		files = libs[name];
		if(!Array.isArray(files)){
			files = [files];
		}

		for(var i = 0; i < files.length; i++){
			file = files[i];
			path = `./bower_components/${name}/${file}`;

			try{
				fs.accessSync(path);
			}catch(err){
				console.log(`ERROR!!! File does not exists ${path}`);
				continue;
			}

			if(returnFilePath){
				file = path;
			}
			else{
				var re = new RegExp(`([^\\/]+\\.(${libTypes.join('|')}))$`, 'ig');
				file = file.match(re)[0];

				if(!file){
					console.log(`ERROR!!! Can't parse filename from ${libs[name]}`);
					continue;
				}
			}

			libFiles.push(file);
		}
	}

	return libFiles;
};

exports.getCustomFile = function(type){
	var reMap = {
		js: '^script\\.\\S+\\.js$',
		css: '^style\\.\\S+\\.css$'
	};

	var re = new RegExp(reMap[type], 'ig');

	var files, file, match;

	try{
		files = fs.readdirSync('build');
	}catch(err){
		log.e(`There no build directory.`);
		return null;
	}

	for(var i in files){
		file = files[i];
		match = file.match(re);
		if(match) return match[0]
	}

	log.e(`There no custom ${type} file in the build directory`)
	return null;
};