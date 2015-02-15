(function () {
  'use strict';
  var gulp = require('gulp'),
      connect = require('gulp-connect'),
      open = require('gulp-open'),
      del = require('del'),
      shell = require('gulp-shell'),
      autoprefixer = require('gulp-autoprefixer'),
      sass = require('gulp-sass');

  var paths = {
    dest: 'dist',
    temp: '_tmp'
  };

  gulp.task('sass', function () {
    gulp.src('app/scss/app.scss')
      .pipe(sass())
      .pipe(autoprefixer(['> 1%', 'last 2 versions'], { cascade: true }))
      .pipe(gulp.dest(paths.temp + '/css'));
  });

  gulp.task('connect', ['sass'], function() {
    connect.server({
      root: ['app', paths.temp],
      port: 1336,
      livereload: true
    });
  });

  gulp.task('html', ['sass'], function() {
    gulp.src('./app/*.html').pipe(connect.reload());
  });

  gulp.task('watch', function() {
    gulp.watch(['app/*.html', 'app/scss/**/*'], ['html']);
  });

  gulp.task('open', ['connect', 'watch'], function(){
    gulp.src('app/index.html')
    .pipe(open('', { url: 'http://localhost:1336' }));
  });

  gulp.task('clean', function () {
    del([paths.dest, paths.temp]);
  });

  gulp.task('copy_to_dist', ['clean'], function(){
    gulp.src(['app/index.html', 'app/images/**/*'], { base: 'app/' })
    .pipe(gulp.dest(paths.dest));
  });

  gulp.task('deploy', ['build'], shell.task([
    'rsync -rvz dist/ pi:walktocircle.com',
    'echo world'
  ]));

  gulp.task('build', ['copy_to_dist']);

  gulp.task('serve', ['open']);

  gulp.task('default', ['build']);
})();