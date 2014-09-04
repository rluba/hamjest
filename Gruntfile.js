'use strict';

module.exports = function (grunt) {
	// Show elapsed time at the end
	require('time-grunt')(grunt);
	// Load all grunt tasks
	require('load-grunt-tasks')(grunt);

	var serverTestDir = 'test/';

	// Project configuration.
	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: true,
				force: true,
				reporter: require('jshint-stylish')
			},
			project: {
				src: [
					'*.js',
					'grunt/**/*.js'
				]
			},
			lib: {
				src: ['lib/**/*.js']
			},
			test: {
				src: [serverTestDir + '**/*.js']
			}
		},
		mochaTest: {
			unit: {
				options: {
					reporter: 'spec',
					force: true
				},
				src: [serverTestDir + '{,*/}*Spec.js']
			},
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.project.src %>',
				tasks: ['jshint:project']
			},
			lib: {
				files: '<%= jshint.lib.src %>',
				tasks: ['jshint:lib', 'mochaTest']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'mochaTest']
			}
		},
		browserify: {
			dist: {
				src: ['hamjest.js'],
				dest: 'dist/hamjest.js',
				options: {
					'global-shim': {
						'lodash': '_',
						'q': 'Q'
					},
					standalone: 'hamjest'
				}
			},
			distDeps: {
				src: ['hamjest.js'],
				dest: 'dist/hamjest-deps.js',
				options: {
					standalone: 'hamjest'
				}
			}
		},
		uglify: {
			dist: {
				files: {
					'dist/hamjest.min.js': [
						'<%= browserify.dist.dest %>'
					]
				}
			},
			distDeps: {
				files: {
					'dist/hamjest-deps.min.js': [
						'<%= browserify.distDeps.dest %>'
					]
				}
			}
		}
	});

	grunt.registerTask('test', ['jshint', 'mochaTest']);
	grunt.registerTask('build', ['browserify', 'uglify']);

	// Default task.
	grunt.registerTask('default', ['test', 'build']);

};
