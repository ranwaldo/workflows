var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var browserify = require('gulp-browserify');
var compass = require('gulp-compass');
var connect = require('gulp-connect');
var concat = require('gulp-concat');

var coffeeSources = [                                     // all coffee sources to be processed
  'components/coffee/tagline.coffee'
];
var jsSources = [                                         // all js files to be combined into 1 file
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
var sassSources = [                                       // all sass sources
  'components/sass/style.scss'
];
var htmlSources = [                                       // all html sources
  'builds/development/*.html'
];
var jsonSources = [                                       // all json sources
  'builds/development/js/*.json'
];

gulp.task('coffee', function() {                          // create task 'coffee'
  gulp.src(coffeeSources)                                 // the sources
    .pipe(coffee({ bare: true })                          // pipe to gulp-coffee, option bare, no top-level function safety wrapper
    .on('error', gutil.log))                              // handle error, log
    .pipe(gulp.dest('components/scripts'))                // pipe to output file, ex tagline.js
});
gulp.task('js', function() {                              // create task 'js'
  gulp.src(jsSources)                                     // the sources
    .pipe(concat('script.js'))                            // pipe to concat, with output filename
    .pipe(browserify())                                   // pipe to browserify
    .pipe(gulp.dest('builds/development/js'))             // pipe to dest dir
    .pipe(connect.reload())                               // add pipe to reload server
});
gulp.task('compass', function() {                         // create task 'compass'
  gulp.src(sassSources)                                   // input, the sources
    .pipe(compass({                                       // pipe to gulp-compass (options could be in config.rb or here like this)
      sass: 'components/sass',                            // input dir
      image: 'builds/development/images',                 // images dir
      style: 'expanded'                                   // more human readable
      })
     )
    .on('error', gutil.log)                               // handle error, log it
    .pipe(gulp.dest('builds/development/css'))            // pipe to output dir
    .pipe(connect.reload())                               // add pipe to reload server
});
gulp.task('watch', function() {                           // create task 'watch'
  gulp.watch(coffeeSources, ['coffee']);                  // when any coffee file changes, run task 'coffee'
  gulp.watch(jsSources, ['js']);                          // when any js file changes, run task 'js'
  gulp.watch('components/sass/*.scss', ['compass']);      // when any sass file changes, run task 'compass'
  gulp.watch(htmlSources, ['html']);                      // when any html file changes, run task 'html'
  gulp.watch(jsonSources, ['json']);   // when any json file changes, run task 'json'
});
gulp.task('html', function() {                            // create task 'html'
  gulp.src(htmlSources)                                   // the sources
    .pipe(connect.reload())                               // add pipe to reload server
});
gulp.task('json', function() {                            // create task 'json'
  gulp.src(jsonSources)                                   // the sources
    .pipe(connect.reload())                               // add pipe to reload server
});

gulp.task('default', ['html','json','coffee','js','compass','connect','watch']);  // create task 'default', with dependencies

gulp.task('connect', function() {                         // create task 'connect'
  connect.server({                                        // call server()
    root: 'builds/development/',                          // document root
    port: 9000,                                           // set port
    livereload: true                                      // do live reloads
  });
});
