'use strict';

process.env.BLUEBIRD_DEBUG = 1;

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserify = require('browserify');
const del = require('del');
const sourceStream = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const KarmaServer = require('karma').Server;

const jsFiles = [
	'*.js',
	'lib/**/*.js',
	'test/**/*.js'
];

gulp.task('default', ['clean'], () => {
	return gulp.start(['build', 'test:browser']);
});

gulp.task('lint', () => {
	return gulp.src(jsFiles)
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.eslint.failAfterError());
});

gulp.task('test', ['test:node']);

gulp.task('test:node', () => {
	return gulp.src('test/node/**/*Spec.js', {read: false})
		.pipe($.mocha({
			reporter: 'spec'
		}));
});

gulp.task('test:browser', ['build'], (done) => {
	const karmaConfig = {
		browsers: ['Chrome', 'Firefox'],
		frameworks: ['mocha'],
		reporters: ['progress'],
		autoWatch: false,
		singleRun: true,
		files: [
			'dist/hamjest.js',
			'test/browser/**/*.js'
		]
	};

	const server = new KarmaServer(karmaConfig, done);
	server.start();
});

gulp.task('build', ['lint', 'test'], () => {
	const b = browserify({
		entries: './index.js',
		standalone: 'hamjest',
		debug: true
	}).transform('babelify', {presets: ['es2015']});

	return b.bundle()
		.pipe(sourceStream('hamjest.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./dist'))
		.pipe($.uglify())
		.pipe($.rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('clean', () => {
	return del('./dist');
});

gulp.task('dev', () => {
	gulp.watch(jsFiles, ['lint', 'test']);
});
