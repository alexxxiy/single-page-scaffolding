'use strict';
const gulp         = require('gulp');
const sourcemaps   = require('gulp-sourcemaps');
const plumber      = require('gulp-plumber');
const pug          = require('gulp-pug');
const scss         = require('gulp-sass');
// const browserSync  = require('browser-sync').create();
// const reload       = browserSync.reload;
const debug        = require('gulp-debug');
const gulpIf       = require('gulp-if');
const rename       = require('gulp-rename');
// const PATH         = require('path');
// const svgmin       = require('gulp-svgmin');
// const uglify       = require('gulp-uglify');
const hash         = require('hash-files');
const cleanCSS     = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const webpack      = require('gulp-webpack');
const fs           = require('fs');

var webpackConf    = require('../webpack.config');
const libUtils     = require('./lib-utils');


gulp.task('lib', function(done){
	var libs = libUtils.getAllLibrariesFileNames(true);

	if(!libs || !libs.length) return done();

	return gulp.src(libs)
		.pipe(plumber())
		.pipe(debug({title: 'lib'}))
		.pipe(gulp.dest('build'))
});

gulp.task('pug', function(){
	return gulp.src(['src/pug/entry.pug'])
		.pipe(plumber())
		.pipe(pug({
			locals: {
				jsLibs: libUtils.getLibrariesFileNamesByType('js'),
				cssLibs: libUtils.getLibrariesFileNamesByType('css')
			}
		}))
		.pipe(debug({title: 'pug'}))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('build'));
});

gulp.task('scss', function(){
	return gulp.src(['src/scss/entry.scss'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(scss())
		.pipe(debug({title: 'scss'}))
		.pipe(sourcemaps.write())
		.pipe(autoprefixer({browsers: ['last 2 versions'],cascade: false}))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(rename('style.css'))
		.pipe(gulp.dest('build'))
});

var manifest = {
	js: '',
	css: ''
};

gulp.task('js', function(){
	var sha = hash.sync({files: ['src/js/entry.js']}).slice(0,10);

	return gulp.src(['src/js/entry.js'])
		.pipe(webpack(webpackConf))
		// .on('data', (file)=>{
		// 	let fileName = file.path.match(/[^\/\\]+$/i)[0];
		// 	if(fileName !== 'script.js') return;
		// 	sha = hash.sync({files: [file.path]}).slice(0,10);
		// 	console.log(fileName, sha);
		// })
		.pipe(rename((path)=>{
			path.basename = path.basename.replace('script', 'script.' + sha);

			if(path.extname === '.js'){
				manifest.js = path.basename + path.extname;
			}

		}))
		.pipe(debug({title: 'JS'}))
		.pipe(gulp.dest('.'))
});

gulp.task('images', function(){
	return gulp.src(['src/images/*.*'])
		.pipe(gulp.dest('build'))
});

gulp.task('watch', function(){
	gulp.watch(['src/pug/**/*.pug'], gulp.series('pug'));
	gulp.watch(['src/scss/**/*.scss'], gulp.series('scss'));
	gulp.watch(['src/js/**/*.js'], gulp.series('js'));
	gulp.watch(['lib.conf.json'], gulp.series(libUtils.resetCache, 'pug', 'lib'));
});


gulp.task('default', gulp.series('pug', 'scss', 'js', 'images', 'lib', 'watch'));
