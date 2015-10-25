var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var coffeeSources = [                                    // all coffee sources to be processed
  'components/coffee/tagline.coffee'
];
var jsSources = [                                        // all js files to be combined into 1 file
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
gulp.task('coffee', function() {                          // create a task 'coffee'
  gulp.src(coffeeSources)                                 // the sources
    .pipe(coffee({ bare: true })                          // pipe to gulp-coffee, option bare, no top-level function safety wrapper
     .on('error', gutil.log))                             // handle error, log
    .pipe(gulp.dest('components/scripts'))                // pipe to output file, ex tagline.js
});
gulp.task('js', function() {                              // create a task 'js'
  gulp.src(jsSources)                                     // the sources
    .pipe(concat('script.js'))                            // pipe to concat, with output filename
    .pipe(gulp.dest('builds/development/js'))             // pipe to dest dir
});
