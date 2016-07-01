/* jshint node: true */
/* jshint -W100 */
'use strict';
var gulp = require("gulp");
var babel = require("gulp-babel");
var browserSync = require('browser-sync');
var concat = require("gulp-concat");
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var postcss = require('gulp-postcss');
var notify = require("gulp-notify");
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require("gulp-sourcemaps");
var uglify = require('gulp-uglify');
var strip = require('gulp-strip-comments');
var stripCssComments = require('gulp-strip-css-comments');
var del = require('del');
var sequence = require('gulp-sequence');

var config = {
  sassPath: './src/scss',
  npmDir: './node_modules',
  bowerDir: './bower_components'
};

gulp.task('clean:dist', function () {
  return del([
    'dist/css/**/*',
    'dist/js/**/*',
    'dist/fonts/**/*',
  ]);
});

gulp.task('copy-font-awesome', function() {return gulp.src(config.npmDir + '/font-awesome/fonts/**.*') 
  .pipe(gulp.dest('./dist/fonts')); 
});

gulp.task('copy-open-iconic', function() {return gulp.src(config.npmDir + '/open-iconic/font/fonts/**.*') 
  .pipe(gulp.dest('./dist/fonts')); 
});

gulp.task('compile-scss', function () {
  gulp.src('src/scss/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({includePaths: [
    'src/scss',
    config.npmDir + '/bootstrap/scss',
    config.npmDir + '/open-iconic/font/css',
    config.npmDir + '/font-awesome/scss',
    config.npmDir + '/selectize-scss/src',
  ]}))
  // gulp should be called like this :
  // $ gulp --type production
  //if you want production output
  .pipe(stripCssComments({preserve: false}))
  .pipe(sass({outputStyle: 'nested'}) )
  .on("error", notify.onError(function (error) {
    return "Error: " + error.message;
  }))
  .pipe(postcss([
      require('autoprefixer')
  ]))
  .pipe(gulp.dest('dist/css'));
});

gulp.task("compile-es6-js", function () {
  return gulp.src("src/js/es6/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat("scripts_es6.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/js"));
});

gulp.task('sequence-copy-core', sequence(
  'clean:dist',
  [
    'copy-font-awesome',
    'copy-open-iconic',
    'compile-scss',
    'compile-es6-js'
  ],
  'browser-sync'
));
