'use strict'
const fs      = require('fs');
const colors  = require('colors');
const log     = require('./logger')(module);


const reURL  = new RegExp('^(https?|ftp)\\:\\/\\/[^\\s\\/\\$\\.\\?\\#].*$');
var libConf  = require('../lib.conf.json');
var libTypes = Object.keys(libConf);

function resetCache(done){
	delete require.cache[require.resolve('../lib.conf.json')];
	libConf = require('../lib.conf.json');

	libTypes = Object.keys(libConf);
	done();

};

/**
 * Возвращает все полные пути к файлам библиотек из файла lib.conf.json
 * @param  {Boolean} returnFilePath - true - возвращать полный путь от корня проекта, false - только имя файла
 * @param  {String} returnFilePath  - где файл будет лежать в директории билда
 * @return {Array}
 */
function getAllLibrariesFileNames(pathInBuild, returnFilePath=false){
	var result = libTypes.reduce(function(res, type){
		return res.concat(getLibrariesFileNamesByType(type, pathInBuild, returnFilePath));
	}, []);

	return result;
};

/**
 * Возвращает все файлы библиотек из файла lib.conf.json
 * @param  {String}  type           - js, css и т.д.
 * @param  {String} returnFilePath  - где файл будет лежать в директории билда
 * @param  {Boolean} returnFilePath - true - возвращать полный путь от корня проекта, false - только имя файла
 * @return {Array}
 */
function getLibrariesFileNamesByType(type, pathInBuild, returnFilePath=false){
	var libs = libConf[type];
	var libFiles = [];
	var file, files, path;

	if(!libs){
		log.e(`ERROR_01 No libraries with type "${type}"`);
		return libFiles;
	}

	for(var name in libs){
		files = libs[name];
		if(!Array.isArray(files)){
			files = [files];
		}

		for(var i = 0; i < files.length; i++){
			file = files[i];

			if(reURL.test(file)){
				if(!returnFilePath){
					libFiles.push(file);
				}
				continue;
			}

			path = `./bower_components/${name}/${file}`;

			try{
				fs.accessSync(path);
			}catch(err){
				log.e(`ERROR_02 File does not exists ${path}`);
				continue;
			}

			if(returnFilePath){
				file = path;
			}
			else{
				var re = new RegExp(`([^\\/]+\\.(${libTypes.join('|')}))$`, 'ig');
				file = file.match(re)[0];

				if(!file){
					log.e(`ERROR_03 Can't parse filename from ${libs[name]}`);
					continue;
				}

				if(pathInBuild){
					file = `${pathInBuild}/${file}`
				}
			}

			libFiles.push(file);
		}
	}

	return libFiles;
};

function getCustomFile(type){
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


module.exports = {
	libTypes,
	resetCache,
	getAllLibrariesFileNames,
	getLibrariesFileNamesByType,
	getCustomFile
}
