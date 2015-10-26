var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var browserify = require('gulp-browserify');
var compass = require('gulp-compass');
var connect = require('gulp-connect');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyJson = require('gulp-jsonminify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var concat = require('gulp-concat');

var env, coffeeSources, jsSources, sassSources,           // declare variables
    htmlSources, jsonSources, outputDir, sassStyle;

var env = process.env.NODE_ENV || 'development';          // get env var NODE.ENV
if (env === 'development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

coffeeSources = [                                         // all coffee sources to be processed
  'components/coffee/tagline.coffee'
];
jsSources = [                                             // all js files to be combined into 1 file
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
sassSources = [                                           // all sass sources
  'components/sass/style.scss'
];
htmlSources = [                                           // all html sources
  outputDir + '/*.html'
];
jsonSources = [                                           // all json sources
  outputDir + '/js/*.json'
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
    .pipe(gulpif(env === 'production', uglify()))         // only in production, minify
    .pipe(gulp.dest(outputDir + '/js'))                   // pipe to dest dir
    .pipe(connect.reload())                               // add pipe to reload server
});
gulp.task('compass', function() {                         // create task 'compass'
  gulp.src(sassSources)                                   // input, the sources
    .pipe(compass({                                       // pipe to gulp-compass (options could be in config.rb or here like this)
      sass: 'components/sass',                            // input dir
      image: outputDir + '/images',                       // images dir
      style: sassStyle                                    // more human readable
      })
     )
    .on('error', gutil.log)                               // handle error, log it
    .pipe(gulp.dest(outputDir + '/css'))                  // pipe to output dir
    .pipe(connect.reload())                               // add pipe to reload server
});
gulp.task('watch', function() {                           // create task 'watch'
  gulp.watch(coffeeSources, ['coffee']);                  // when any coffee file changes, run task 'coffee'
  gulp.watch(jsSources, ['js']);                          // when any js file changes, run task 'js'
  gulp.watch('components/sass/*.scss', ['compass']);      // when any sass file changes, run task 'compass'
  gulp.watch('builds/development/*.html', ['html']);      // when a dev html file changes, run task 'html'
  gulp.watch('builds/development/js/*.json', ['json']);   // when a dev json file changes, run task 'json'
  gulp.watch('builds/development/images/**/*.*', ['images']);  // when a dev images file changes, run task 'images'
});
gulp.task('html', function() {                                 // create task 'html'
  gulp.src('builds/development/*.html')                        // the dev sources
    .pipe(gulpif(env === 'production', minifyHtml()))          // only in production, minify
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))  // only in production, copy to output dir
    .pipe(connect.reload())                                    // add pipe to reload server
});
gulp.task('images', function() {                               // create task 'images'
  gulp.src('builds/development/images/**/*.*')                 // in dev images, all subdirs
    .pipe(gulpif(env === 'production', imagemin({              // only in production, minify
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))                       // only in production, minify
    .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))  // only in production, copy to output dir
    .pipe(connect.reload())                                    // add pipe to reload server
});
gulp.task('json', function() {                                 // create task 'json'
  gulp.src('builds/development/js/*.json')                     // the sources
    .pipe(gulpif(env === 'production', minifyJson()))                       // only in production, minify
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))  // only in production, copy to output dir
    .pipe(connect.reload());                                    // add pipe to reload server
});

gulp.task('default', ['html','json','coffee','js','compass','images','connect','watch']);  // create task 'default', with dependencies

gulp.task('connect', function() {                         // create task 'connect'
  connect.server({                                        // call server()
    root: outputDir,                                      // document root
    port: 9000,                                           // set port
    livereload: true                                      // do live reloads
  });
});
