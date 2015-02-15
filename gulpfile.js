(function () {
  'use strict';
  var gulp = require('gulp'),
      connect = require('gulp-connect'),
      open = require('gulp-open'),
      del = require('del');

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

  gulp.task('watch', function() {
    gulp.watch(['app/*.html', 'app/scss/**/*', 'app/js/**/*'], ['html']);
  });

  gulp.task('open', ['connect', 'watch'], function(){
    gulp.src('app/index.html')
    .pipe(open('', { url: 'http://localhost:1336' }));
  });

  gulp.task('clean', function () {
    del([paths.dest, paths.temp]);
  });

  gulp.task('copy_to_dist', ['clean'], function(){
    gulp.src(['app/index.html'], { base: 'app/' })
    .pipe(gulp.dest(paths.dest));
  });

  gulp.task('build', ['copy_to_dist']);

  gulp.task('serve', ['open']);

  gulp.task('default', ['build']);
})();