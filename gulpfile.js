(function () {
  'use strict';
  var gulp = require('gulp'),
      connect = require('gulp-connect'),
      open = require('gulp-open'),
      del = require('del'),
      shell = require('gulp-shell');

  var paths = {
    dest: 'dist',
    temp: '_tmp'
  };

  gulp.task('connect', function() {
    connect.server({
      root: ['app', paths.temp],
      port: 1336,
      livereload: true
    });
  });

  gulp.task('html', function() {
    gulp.src('./app/*.html').pipe(connect.reload());
  });

  gulp.task('watch', function() {
    gulp.watch(['app/*.html', 'app/css/*'], ['html']);
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