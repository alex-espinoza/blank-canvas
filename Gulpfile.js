'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var cssnano = require('cssnano');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var pump = require('pump');
var browserSync = require('browser-sync').create();

gulp.task('serve', ['sass', 'javascript', 'vendor-css', 'vendor-js'], function() {
  browserSync.init({
    server: {
      baseDir: './',
      directory: true
    }
  });

  gulp.watch('src/sass/*.sass', ['sass']);
  gulp.watch('src/js/*.js', ['javascript-reload']);
  gulp.watch('src/*.html').on('change', browserSync.reload);
});

gulp.task('sass', function() {
  var plugins = [
    cssnext({browsers: ['> 1%']}),
    cssnano(),
  ];

  return gulp.src('src/sass/*.sass')
          .pipe(sass().on('error', sass.logError))
          .pipe(postcss(plugins))
          .pipe(gulp.dest('./src/css/'))
          .pipe(browserSync.stream())
});

gulp.task('javascript', function() {
  var options = {
    mangle: {
      toplevel: true,
    },
  };

  return gulp.src('src/js/*.js')
          .pipe(babel({
            presets: ['@babel/env']
          }))
          .pipe(uglify(options).on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); }))
          .pipe(rename("site.min.js"))
          .pipe(gulp.dest('./src/scripts/'))
});

gulp.task('javascript-reload', ['javascript'], function() {
  browserSync.reload();
});

gulp.task('vendor-css', function() {
  var files = [
    'src/vendor-css/jquery.fullpage.min.css',
  ];

  return gulp.src(files)
          .pipe(concat('vendor.min.css'))
          .pipe(gulp.dest('./src/css/'))
});

gulp.task('vendor-js', function() {
  var files = [
    'src/vendor-js/jquery-3.3.1.min.js',
    'src/vendor-js/jquery.fullpage.min.js',
  ];

  return gulp.src(files)
          .pipe(concat('vendor.min.js'))
          .pipe(gulp.dest('./src/scripts/'))
});

gulp.task('default', ['serve']);
