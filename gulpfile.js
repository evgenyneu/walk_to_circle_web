(function () {
  'use strict';
  var gulp = require('gulp'),
      connect = require('gulp-connect'),
      open = require('gulp-open');

  var paths = {
    temp: '_tmp'
  };

  gulp.task('connect', function() {
    connect.server({
      root: ['app', paths.temp],
      port: 1336,
      livereload: true
    });
  });

  gulp.task('watch', function() {
    gulp.watch(['app/*.html', 'app/scss/**/*', 'app/js/**/*'], ['html']);
  });

  gulp.task('open', ['connect', 'watch'], function(){
    gulp.src('app/index.html')
    .pipe(open('', { url: 'http://localhost:1336' }));
  });

  gulp.task('serve', ['open']);

  gulp.task('default', function() {
    // place code for your default task here
  });
})();