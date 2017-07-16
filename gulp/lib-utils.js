const fs           = require('fs');
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
	var file;

	if(!libs){
		console.log(`ERROR!!! No libraries with type "${type}"`);
		return libFiles;
	}

	for(var name in libs){
		var path = `./bower_components/${name}/${libs[name]}`;
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
			file = libs[name].match(/([^\/]+\.(js|css))$/ig)[0];

			if(!file){
				console.log(`ERROR!!! Can't parse filename from ${libs[name]}`);
				continue;
			}
		}

		libFiles.push(file);
	}

	return libFiles;
};