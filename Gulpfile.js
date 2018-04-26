'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var cssnano = require('cssnano');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var pump = require('pump');
var browserSync = require('browser-sync').create();
var gutil = require('gulp-util');

gulp.task('serve', ['sass', 'javascript'], function() {
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
          .pipe(gulp.dest('./src/scripts/'))
});

gulp.task('javascript-reload', ['javascript'], function() {
  browserSync.reload();
});

gulp.task('default', ['serve']);
