'use strict'
const gulp         = require('gulp');
const sourcemaps   = require('gulp-sourcemaps');
const plumber      = require('gulp-plumber');
const pug          = require('gulp-pug');
const sass         = require('gulp-sass');
// const browserSync  = require('browser-sync').create();
// const reload       = browserSync.reload;
const debug        = require('gulp-debug');
const gulpIf       = require('gulp-if');
const rename       = require('gulp-rename');
const replace      = require('gulp-replace');
const touch        = require('gulp-touch');
// const PATH         = require('path');
// const svgmin       = require('gulp-svgmin');
const uglify       = require('gulp-uglify');
const htmlmin      = require('gulp-htmlmin');
const hash         = require('hash-files');
// const ghash        = require('gulp-hash');
const cleanCSS     = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const webpack      = require('gulp-webpack');
const del          = require('del');
const fs           = require('fs');
const colors       = require('colors');
const utils        = require('./utils');


// Some constants
const NODE_ENV = process.env.NODE_ENV || 'DEVELOPMENT';
const PROD = (NODE_ENV.toUpperCase() === 'PRODUCTION');
const DEV = !PROD;
const buildDirectory = 'build';
const commonDirectory = 'common';


//------------------------------
const _build      = buildDirectory;
const _common     = `${buildDirectory}/${commonDirectory}`;
const webpackConf = require('../webpack.config')(buildDirectory, NODE_ENV);
const manifest    = {
	js: '',
	css: ''
};
//------------------------------

// Copy libraries
gulp.task('lib', function(done){
	const libs = utils.getAllLibrariesFileNames(commonDirectory, true);

	if(!libs || !libs.length) return done();

	return gulp.src(libs)
		.pipe(plumber())
		.pipe(debug({title: 'lib'}))
		.pipe(gulp.dest(_common));
});

// HTML (Pug)
gulp.task('pug', function(done){
	manifest.js = manifest.js || utils.getCustomFile('js');
	manifest.css = manifest.css || utils.getCustomFile('css');

	if(!manifest.js || !manifest.css){
		return done();
	}

	return gulp.src(['src/pug/entry.pug'])
		.pipe(plumber())
		.pipe(pug({
			pretty: true,
			locals: {
				jsLibs: utils.getLibrariesFileNamesByType('js', commonDirectory),
				cssLibs: utils.getLibrariesFileNamesByType('css', commonDirectory),
				manifest: manifest,
				common: commonDirectory
			}
		}))
		.pipe(debug({title: 'pug'}))
		.pipe(rename('index.html'))
		.pipe(gulpIf(PROD, htmlmin({collapseWhitespace: true})))
		.pipe(gulp.dest(_build))
		.pipe(touch());
});

gulp.task('clean:html', (done)=>{
	del.sync([`${_build}/index.html`]);

	return done();
});

gulp.task('clean:html', (done)=>{
	del.sync([`${_build}/index.html`]);

	return done();
});

// CSS (SCSS)
gulp.task('build:css', function(){
	const sha = hash.sync({files: ['src/scss/*.scss']}).slice(0,10);

	return gulp.src(['src/scss/entry.scss'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(debug({title: 'scss'}))
		.pipe(autoprefixer({browsers: ['last 2 versions'],cascade: false}))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(rename((path)=>{
			path.basename = path.basename.replace('entry', 'style.' + sha);

			manifest.css = path.basename + path.extname;
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(_build));
});

gulp.task('clean:css', ()=>{
	return del([`${_build}/style.*.css`]);
});

gulp.task('css', gulp.series('clean:html', 'clean:css', 'build:css', 'pug'));

// JS
gulp.task('build:js', function(){
	const sha = hash.sync({files: ['src/js/*.js']}).slice(0,10);

	return gulp.src(['src/js/entry.js'])
		.pipe(webpack(webpackConf))
		.pipe(gulpIf(path => PROD && path.extname === '.js' /* exclude *.js.map files */, uglify()))
		.pipe(rename((path)=>{
			path.basename = path.basename.replace('script', 'script.' + sha);

			if(path.extname === '.js'){
				manifest.js = path.basename + path.extname;
			}
		}))
		.pipe(replace('script.js.map', `script.${sha}.js.map`))
		.pipe(debug({title: 'JS'}))
		.pipe(gulp.dest('.'));
});

gulp.task('images', function(){
	return gulp.src(['src/images/*.*'])
		.pipe(gulp.dest(_build));
});

gulp.task('clean:js', ()=>{
	return del([`${_build}/script.*.js`, `${_build}/script.*.js.map`]);
});

gulp.task('js', gulp.series('clean:html', 'clean:js', 'build:js', 'pug'));

// Different common files
gulp.task('common', ()=>{
	return gulp.src(['src/common/**/*.*'])
		.pipe(gulp.dest(_common));
});

// Clean
gulp.task('clean', ()=>{
	return del([`${_build}/**/*`]);
});

// Watch
gulp.task('watch', function(){
	gulp.watch(['src/pug/**/*.pug'], gulp.series('pug'));
	gulp.watch(['src/scss/**/*.scss'], gulp.series('css'));
	gulp.watch(['src/js/**/*.js'], gulp.series('js'));
	gulp.watch(['src/common/**/*.*'], gulp.series(['common']));
	gulp.watch(['lib.conf.json'], gulp.series(utils.resetCache, 'pug', 'lib'));
});

// Default
gulp.task('default', gulp.series('clean', 'build:css', 'build:js', 'images', 'lib', 'common','pug', 'watch'));

gulp.task('build', gulp.series('clean', 'build:css', 'build:js', 'images', 'lib', 'common','pug'));
