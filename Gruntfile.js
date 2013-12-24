module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		// Task: Lint all JS files
		jshint: {
			files: ['public/js/application/**/*.js', 'app/**/*.js', 'config/**/*.js'],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Task: Lint all HTML files
		htmllint: {
			all: ["app/views/**/*.html.ejs"]
		},

		// Task: Compile SASS to CSS
		less: {
			compile: {
				files: {
					'public/styles/style.css': 'public/styles/style.less'
				}
			}
		},

		// Task: Lint CSS
		csslint: {
			strict: {
				options: {
			    csslintrc: '.csslintrc'
			  },
				src: ['public/styles/style.css']
			}
		},

		// Task: Uglify build JS
		requirejs: {
			production: {
				options: {
					name: 'app',
					baseUrl: "public/js/application",
					mainConfigFile: "public/js/application/bootstrap.js",
					out: "public/js/build/build.js"
				}
			}
		},

		// Task: Restart Node
		nodemon: {
			dev: {
				options: {
					file: 'app/server.js'
				}
			}
		},

		// Task: Concurrent
		concurrent: {
			dev: {
				options: {
					logConcurrentOutput: true
				},
				tasks: ['watch', 'nodemon']
			}
		},

		// Task: Watch
		watch: {
			jshint: {
				files: ['public/js/**/*.js', 'Gruntfile.js'],
				tasks: ['jshint']
			},
			less: {
				files: ['public/styles/*.less'],
				tasks: ['less']
			},
			csslint: {
				files: ['public/styles/style.css'],
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			},
			html: {
				files: ['app/views/**/*.html.ejs'],
				options: {
					livereload: true
				}
			},
			mocha: {
				files: ['app/**/*.js', 'config/**/*.js'],
				tasks: ['jshint']
			}
		}

	});

	// Load the plugin for watch
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Load the plugin for JSHint
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Load the plugin for HTML lint
	grunt.loadNpmTasks('grunt-html');

	// Load the plugin for HTML lint
	grunt.loadNpmTasks('grunt-contrib-csslint');

	// Load the plugin for LESS
	grunt.loadNpmTasks('grunt-contrib-less');

	 // Load the plugin for RequireJS
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	// Load the plugin for develop
	grunt.loadNpmTasks('grunt-nodemon');

	// Load the plugin for parrallel tasks
	grunt.loadNpmTasks('grunt-concurrent');

	// Default task(s)
	grunt.registerTask('default', ['jshint']);
};