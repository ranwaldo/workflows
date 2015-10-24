var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var coffeeSources = ['components/coffee/tagline.coffee']; // can be multiple
gulp.task('coffee', function() {                          // create a coffee 'task'
  gulp.src(coffeeSources)                                 // do all sources
    .pipe(coffee({ bare: true })                          // pipe to gulp-coffee, option bare, no top-level function safety wrapper
     .on('error', gutil.log))                             // handle error, log
    .pipe(gulp.dest('components/scripts'))                // pipe to output file, ex tagline.js
});
