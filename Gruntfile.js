(function () {
    "use strict";
    module.exports = function (grunt) {
        // Load grunt tasks automatically
        require('load-grunt-tasks')(grunt);

        // Show grunt task time
        require('time-grunt')(grunt);

        function lastModified(minutes) {
            return function(filepath) {
                var filemod = (require('fs').statSync(filepath)).mtime;
                var timeago = (new Date()).setDate((new Date()).getMinutes() - minutes);
                return (filemod > timeago);
            };
        }

        // Configurable paths for the app
        var appConfig = {
            app: 'app',
            dist: 'dist'
        };

        // Grunt configuration
        grunt.initConfig({
            karma: {
                options: {
                    configFile: 'tests/karma.conf.js'
                },
                unit: {
                    reporters: ['junit', 'coverage']
                },
                dev: {
                    reporters: ['dots']
                },
                debug: {
                    client: {
                        args: ['debug=true']
                    },
                    singleRun: false
                }
            },

            jshint: {
                options: {
                    reporter: require('jshint-stylish'),
                    jshintrc: '.jshintrc'
                },
                all: {
                    src: [
                        'Gruntfile.js',
                        'app/scripts/**/*.js'
                    ],
                    filter: lastModified(7 * 24 * 60) // modified in last 7 days
                }
            },

            shell: {
                gitHooks: {
                    // Copy the project's git hooks into .git/hooks
                    command: 'rm -Rf .git/hooks && cp -R dev/git/hooks .git/hooks'
                }
            },


            // Project settings
            inspinia: appConfig,

            // The grunt server settings
            connect: {
                options: {
                    port: 9009,
                    hostname: 'localhost',
                    livereload: 35729
                },
                livereload: {
                    options: {
                        open: true,
                        middleware: function (connect) {
                            return [
                                connect.static('.tmp'),
                                connect().use(
                                    '/bower_components',
                                    connect.static('./bower_components')
                                ),
                                connect.static(appConfig.app)
                            ];
                        }
                    }
                },
                dist: {
                    options: {
                        open: true,
                        base: '<%= inspinia.dist %>'
                    }
                }
            },
            // Watch for changes in live edit
            watch: {
                js: {
                    files: ['<%= inspinia.app %>/scripts/{,*/}*.js'],
                    options: {
                        livereload: '<%= connect.options.livereload %>'
                    }
                },
                livereload: {
                    options: {
                        livereload: '<%= connect.options.livereload %>'
                    },
                    tasks: ['ngtemplates'],
                    files: [
                        '<%= inspinia.app %>/**/*.html',
                        '<%= inspinia.app %>/**/**/*.html',
                        '<%= inspinia.app %>/**/**/*.css',
                        '.tmp/styles/{,*/}*.css',
                        '<%= inspinia.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                    ]
                },
                //run unit tests with karma (server needs to be already running)
                karma: {
                    files: ['app/scripts/**/*.js', 'tests/**/*.test.js'],
                    tasks: ['karma:unit:run']
                }
            },
            // If you want to turn on uglify you will need write your angular code with string-injection based syntax
            // For example this is normal syntax: function exampleCtrl ($scope, $rootScope, $location, $http){}
            // And string-injection based syntax is: ['$scope', '$rootScope', '$location', '$http', function exampleCtrl ($scope, $rootScope, $location, $http){}]
            uglify: {
                options: {
                    mangle: false,
                    sourceMap: {
                        includeSources: true
                    }
                }
            },
            replace: {
                 sourceMaps: {
                     src: ['<%= inspinia.dist %>/scripts/scripts*.js.map', '<%= inspinia.dist %>/scripts/vendor*.js.map'],
                     overwrite: true,
                     replacements: [
                         {
                             from: '../../.tmp/concat/scripts/scripts.js',
                             to: function () {
                                 return grunt.file.expand(appConfig.dist + '/scripts/scripts*.js.map')[0].replace('dist/', '').replace('.map', '');
                             }
                         },
                         {
                             from: '../../.tmp/concat/scripts/vendor.js',
                             to: function () {
                                 return grunt.file.expand(appConfig.dist + '/scripts/vendor*.js.map')[0].replace('dist/', '').replace('.map', '');
                             }
                         }
                     ]
                 }
            },
            // Clean dist folder
            clean: {
                dist: {
                    files: [{
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= inspinia.dist %>/{,*/}*',
                            '!<%= inspinia.dist %>/.git*'
                        ]
                    }]
                },
                server: '.tmp'
            },
            // Copies remaining files to places other tasks can use
            copy: {
                dist: {
                    files: [
                        {
                            expand: true,
                            dot: true,
                            cwd: '<%= inspinia.app %>',
                            dest: '<%= inspinia.dist %>',
                            src: [
                                '*.{ico,png,txt}',
                                '.htaccess',
                                '*.html',
                                'errors/{,*/}*.html',
                                'scripts/{,*/}*.html',
                                'scripts/shared/**/*.html',
                                'scripts/components/**/*.html',
                                'styles/patterns/*.*',
                                'styles/plugins/**/*.*',
                                'img/{,*/}*.*',
                                'robots.txt',
                                'images/{,*/}*.*',
                            ]
                        },
                        {
                            expand: true,
                            dot: true,
                            cwd: 'bower_components/fontawesome',
                            src: ['fonts/*.*'],
                            dest: '<%= inspinia.dist %>'
                        },
                        {
                            expand: true,
                            dot: true,
                            cwd: 'bower_components/summernote/dist',
                            src: ['font/*.*'],
                            dest: '<%= inspinia.dist %>/styles'
                        },
                        {
                            expand: true,
                            dot: true,
                            cwd: 'bower_components/chosen',
                            src: ['*.png'],
                            dest: '<%= inspinia.dist %>/styles'
                        },
                        {
                            expand: true,
                            dot: true,
                            cwd: 'bower_components/bootstrap',
                            src: ['fonts/*.*'],
                            dest: '<%= inspinia.dist %>'
                        },
                        {
                            expand: true,
                            dot: true,
                            cwd: 'bower_components/angular-ui-grid',
                            src: ['**/*.{eot,svg,ttf,woff,woff2}'],
                            dest: '<%= inspinia.dist %>/styles'
                        },
                        {
                            expand: true,
                            dot: true,
                            cwd: 'bower_components/xdLocalStorage/app',
                            src: [
                                'views/*.html',
                                'scripts/services/xd-utils.js',
                                'scripts/xdLocalStoragePostMessageApi.js'
                            ],
                            dest: '<%= inspinia.dist %>/bower_components/xdLocalStorage/app'
                        },
                    ]
                },
                styles: {
                    expand: true,
                    cwd: '<%= inspinia.app %>/styles',
                    dest: '.tmp/styles/',
                    src: '{,*/}*.css'
                }
            },
            // Renames files for browser caching purposes
            filerev: {
                dist: {
                    src: [
                        '<%= inspinia.dist %>/scripts/{,*/}*.js',
                        '<%= inspinia.dist %>/styles/{,*/}*.css',
                        '<%= inspinia.dist %>/styles/fonts/*'
                    ]
                }
            },
            htmlmin: {
                dist: {
                    options: {
                        collapseWhitespace: true,
                        conservativeCollapse: true,
                        collapseBooleanAttributes: true,
                        removeCommentsFromCDATA: true,
                        removeOptionalTags: true
                    },
                    files: [{
                        expand: true,
                        cwd: '<%= inspinia.dist %>',
                        src: [
                            '*.html',
                            'scripts/shared/{,*/}*.html',
                            'scripts/components/**/*.html',
                            'scripts/layouts/{,*/}*.html'
                        ],
                        dest: '<%= inspinia.dist %>'
                    }]
                }
            },
            useminPrepare: {
                html: 'app/index.html',
                options: {
                    dest: 'dist'
                }
            },
            usemin: {
                html: ['dist/index.html']
            },
            ngtemplates:  {
                app: {
                    src: ['app/scripts/components/**/*.html', 'app/scripts/shared/**/*.html'],
                    dest: 'app/scripts/templates.js',
                    options:  {
                        prefix: '/',
                        standalone: true,
                        module: 'qsHubTemplates',
                        htmlmin:  '<%= htmlmin.app %>',
                        url: function (url) {
                            return url.replace('app/', '');
                        },
                        bootstrap: function (module, script, options) {
                            script = script.replace("'use strict';", '');
                            return "(function(angular) {" +
                                "\n'use strict';" +
                                "\nangular.module('" + module + "'" + (options.standalone ? ', []' : '') + ").run([" +
                                "\n'$templateCache'," +
                                "\nfunction($templateCache) {" +
                                "\n" + script + "\n}]);\n}(window."+ options.angular + "));";
                        }
                    }
                }
            }
        });

        // by default run jshint
        grunt.registerTask('default', ['jshint:all']);

        // Run live version of app
        grunt.registerTask('live', [
            'clean:server',
            'copy:styles',
            'connect:livereload',
            'watch'
        ]);

        // Run build version of app
        grunt.registerTask('server', [
            'build',
            'connect:dist:keepalive'
        ]);

        grunt.registerTask('generateVersion', function () {
            // get version from bower file
            var bower = require('./bower.json');
            grunt.file.write('app/scripts/version.js',
                "(function(angular) {\n" +
                "'use strict';\n" +
                "angular.module('qsHub').constant('version', " + bower.version + ");\n" +
                "}(window.angular));"
            );
        });

        // Build version for production
        grunt.registerTask('build', [
            'clean:dist',
            'generateVersion',
            'ngtemplates',
            'useminPrepare',
            'concat',
            'copy:dist',
            'cssmin',
            'uglify',
            'filerev',
            'replace',
            'usemin',
            'htmlmin'
        ]);

        grunt.registerTask('test', [
            'jshint:all', 'karma:dev'
        ]);
        grunt.registerTask('jshint-jenkins', function() {
            grunt.config('jshint.options.reporterOutput', 'tests/reports/js.html');
            grunt.config('jshint.options.reporter', require('jshint-html-reporter'));
            grunt.task.run('jshint');
        });
        grunt.registerTask('test-report', [
            'karma:unit'
        ]);
        grunt.registerTask('test-debug', [
            'karma:debug'
        ]);

        // clean the .git/hooks/pre-commit file then copy in the latest version
        grunt.registerTask('git-hooks', ['shell:gitHooks']);

    };
})();
