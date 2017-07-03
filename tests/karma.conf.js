var isDebug = process.env.DEBUG || false;

module.exports = function(config){
    var customArgsArray = config.client.args,
        customArgsObject,
        tmp;
    if (customArgsArray) {
        customArgsObject = {};
        for (var i in customArgsArray) {
            if (customArgsArray.hasOwnProperty(i) && customArgsArray[i].indexOf('=') !== -1) {
                tmp = customArgsArray[i].split('=');
                customArgsObject[tmp[0]] = tmp[1];
            }
        }
        if (customArgsObject && customArgsObject.debug) {
            isDebug = true;
        }
    }
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath : '../',
        // list of files / patterns to load in the browser
        files : [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/angular/angular.min.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'bower_components/ng-table/dist/ng-table.min.js',
            'bower_components/angular-resource/angular-resource.min.js',
            'bower_components/angular-gravatar/build/angular-gravatar.min.js',
            'bower_components/angular-filter/dist/angular-filter.min.js',
            'bower_components/ng-switchery/src/ng-switchery.js',
            'bower_components/angular-ui-switch/angular-ui-switch.js',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angularjs-toaster/toaster.min.js',
            'bower_components/moment/moment.js',
            'bower_components/bootstrap-daterangepicker/daterangepicker.js',
            'bower_components/angular-daterangepicker/js/angular-daterangepicker.min.js',
            'bower_components/chosen/chosen.jquery.js',
            'bower_components/angular-chosen-localytics/dist/angular-chosen.js',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angular-sanitize/angular-sanitize.min.js',
            'bower_components/angular-ui-select/dist/select.js',
            'bower_components/angular-dropzone/lib/angular-dropzone.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'bower_components/angular-ui-event/dist/event.min.js',
            'bower_components/angular-ui-map/ui-map.min.js',
            'bower_components/summernote/dist/summernote.min.js',
            'bower_components/angular-summernote/dist/angular-summernote.min.js',
            'bower_components/angular-ui-sortable/sortable.min.js',
            'bower_components/ng-focus-if/focusIf.min.js',
            'bower_components/ngstorage/ngStorage.min.js',
            'bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js',
            'bower_components/socket.io-client/socket.io.js',
            'bower_components/airbrake-js-client/dist/client.min.js',
            'bower_components/angular-ui-grid/ui-grid.min.js',
            'bower_components/ui-grid-draggable-rows/js/draggable-rows.js',
            'bower_components/karma-read-json/karma-read-json.js',
            'bower_components/angular-touch/angular-touch.js',
            'bower_components/xdLocalStorage/dist/scripts/ng-xdLocalStorage.min.js',
            'app/scripts/*.js',
            'app/scripts/**/*.js',
            'app/scripts/**/**/*.js',
            // Tests
            'tests/**/*.test.js',
            // Templates
            'app/scripts/**/*.html',
            'app/scripts/shared/**/*.html',
            {
                pattern: '**/*.json',
                included: false
            },
        ],
        autoWatch : false,
        // Continuous Integration mode - if true, it capture browsers, run tests and exit
        singleRun: true,
        background: true,
        frameworks: ['jasmine'],
        // Start these browsers
        browsers : [isDebug ? 'Chrome' : 'PhantomJS'],
        plugins : [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'ng-html2js',
            'karma-ng-html2js-preprocessor',
            'karma-coverage',
        ],
        preprocessors: {
            'app/scripts/**/*.js': 'coverage',
            'app/scripts/**/*.html': ['ng-html2js'],
            'app/scripts/shared/**/*.html': ['ng-html2js']
        },
        ngHtml2JsPreprocessor: {
            moduleName: 'templates',
            stripPrefix: 'app/'
        },
        // level of logging
        logLevel: isDebug ? config.LOG_DEBUG : config.LOG_ERROR,
        // test results reporter to use
        reporters: ['progress', 'junit', 'coverage'],
        junitReporter : {
            outputFile: 'tests/reports/jsunit.xml',
            suite: 'unit',
            useBrowserName: false
        },
        coverageReporter : {
            type : 'html',
            dir : 'tests/reports/coverage/'
        }
    });
};