'use strict';

process.env.BLUEBIRD_DEBUG = 1;

const gulp = require('gulp');
const gulpEslint = require('gulp-eslint');
const gulpMocha = require('gulp-mocha');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserify = require('browserify');
const del = require('del');
const sourceStream = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const typescript = require('gulp-typescript');
const KarmaServer = require('karma').Server;

const jsFiles = [
	'*.js',
	'lib/**/*.js',
	'test/**/*.js'
];

const tsFiles = [
	'*.ts',
	'@types/**/*.ts'
];

function lint() {
	return gulp.src(jsFiles)
		.pipe(gulpEslint())
		.pipe(gulpEslint.format())
		.pipe(gulpEslint.failAfterError());
}

function testTypes() {
	return gulp.src(tsFiles)
		.pipe(typescript({
			lib: ['es2015']
		}));
}

function test(done) {
	return gulp.parallel(testNode, testTypes)(done);
}

function testNode() {
	return gulp.src('test/node/**/*Spec.js', {read: false})
		.pipe(gulpMocha({
			reporter: 'spec'
		}));
}

function testBrowser(done) {
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
}

function buildDist() {
	const b = browserify({
		entries: './index.js',
		standalone: 'hamjest',
		debug: true
	})
	.transform('babelify', {presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					browsers: require('./package.json').browserslist,
				},
				loose: false,
				// modules: false,
				useBuiltIns: 'usage',
				corejs: 'core-js@3',
			},
		]
	]});

	return b.bundle()
		.pipe(sourceStream('hamjest.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./dist'))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./dist'));
}

function clean() {
	return del('./dist');
}

function dev(done) {
	gulp.watch(jsFiles, gulp.parallel(lint, test));
	gulp.watch(tsFiles, testTypes);

	done();
}

const build = gulp.series(
	gulp.parallel(lint, test),
	buildDist,
	testBrowser
);

module.exports = {
	clean,
	build,
	lint,
	dev,
	test,
	default: gulp.series(
		clean,
		build
	)
};

