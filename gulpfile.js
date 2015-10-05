'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var del = require('del');
var sourceStream = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var jsFiles = [
	'*.js',
	'lib/**/*.js',
	'test/**/*.js'
];

gulp.task('default', ['build']);

gulp.task('lint', function () {
	return gulp.src(jsFiles)
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.eslint.failAfterError());
});

gulp.task('test', function () {
	return gulp.src('test/**/*Spec.js', {read: false})
		.pipe($.mocha({
			reporter: 'spec'
		}));
});

gulp.task('build', ['lint', 'test'], function () {
	var b = browserify({
		entries: './hamjest.js',
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

gulp.task('clean', function (done) {
	del('./dist', done);
});

gulp.task('dev', function () {
	gulp.watch(jsFiles, ['lint', 'test']);
});
