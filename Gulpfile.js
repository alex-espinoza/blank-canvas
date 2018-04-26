'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var cssnano = require('cssnano');
var browserSync = require('browser-sync').create();

gulp.task('serve', ['sass, javascripts'], function() {
  browserSync.init({
    server: {
      baseDir: './',
      directory: true
    }
  });

  gulp.watch('source/sass/*.sass', ['sass']);
  gulp.watch('source/js/*.js').on('change', browserSync.reload);
  gulp.watch('source/*.html').on('change', browserSync.reload);
});

gulp.task('sass', function() {
  var plugins = [
    cssnext({browsers: ['> 1%']}),
    cssnano()
  ];

  return gulp.src('source/sass/*.sass')
          .pipe(sass().on('error', sass.logError))
          .pipe(postcss(plugins))
          .pipe(gulp.dest('./source/css/'))
          .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
