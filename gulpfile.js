(function () {
  'use strict';
  var gulp = require('gulp'),
      connect = require('gulp-connect'),
      open = require('gulp-open'),
      del = require('del'),
      shell = require('gulp-shell'),
      autoprefixer = require('gulp-autoprefixer'),
      sass = require('gulp-sass'),
      minifyCss = require('gulp-minify-css'),
      runSequence = require('run-sequence');

  var paths = {
    dest: 'dist',
    temp: '_tmp'
  };

  gulp.task('sass', function () {
    gulp.src('app/scss/app.scss')
      .pipe(sass())
      .pipe(autoprefixer(['> 1%', 'last 2 versions'], { cascade: true }))
      .pipe(minifyCss({ keepBreaks: true }))
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

  gulp.task('copy_css_to_dist', ['sass'], function(){
    gulp.src(['_tmp/css/app.css'])
    .pipe(gulp.dest(paths.dest + '/css'));
  });

  gulp.task('copy_app_to_dist', function(){
    gulp.src(['app/index.html', 'app/privacy_policy/index.html', 'app/images/**/*', 'app/favicon.ico'], { base: 'app/' })
    .pipe(gulp.dest(paths.dest));
  });

  // gulp.task('deploy', ['build'], shell.task([
  //   'rsync -rvz dist/ pi:walktocircle.com',
  //   'echo world'
  // ]));

  gulp.task('deploy', ['build'], shell.task([
    'rsync -rvz dist/ aws:web/walktocircle.com',
    'echo world'
  ]));

  gulp.task('build', function() {
    runSequence('clean', ['copy_app_to_dist', 'copy_css_to_dist']);
  });

  gulp.task('serve', ['open']);

  gulp.task('default', ['build']);
})();