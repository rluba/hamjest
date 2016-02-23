'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var del = require('del');
var sourceStream = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var KarmaServer = require('karma').Server;

var jsFiles = [
	'*.js',
	'lib/**/*.js',
	'test/**/*.js'
];

gulp.task('default', ['clean'], function () {
	return gulp.start(['build', 'test:browser']);
});

gulp.task('lint', function () {
	return gulp.src(jsFiles)
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.eslint.failAfterError())
		.pipe($.jscs())
		.pipe($.jscs.reporter())
		.pipe($.jscs.reporter('fail'));
});

gulp.task('test', ['test:node']);

gulp.task('test:node', function () {
	return gulp.src('test/node/**/*Spec.js', {read: false})
		.pipe($.mocha({
			reporter: 'spec'
		}));
});

gulp.task('test:browser', ['build'], function (done) {
	var karmaConfig = {
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

	var server = new KarmaServer(karmaConfig, done);
	server.start();
});

gulp.task('build', ['lint', 'test'], function () {
	var b = browserify({
		entries: './index.js',
		debug: true
	});

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

gulp.task('clean', function () {
	return del('./dist');
});

gulp.task('dev', function () {
	gulp.watch(jsFiles, ['lint', 'test']);
});
