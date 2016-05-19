var gulp = require('gulp');
var clean = require('gulp-clean');
var stylus = require('gulp-stylus');
var browserSync = require('browser-sync').create();

var paths = {
  html : ['*.hmtl'],
  styles : ['*.css'],
  stylus : ['stylus/**/*.styl'],
  clean : ['styles.css']
}

gulp.task ('stylus', function () {
  return gulp.src('./stylus/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./'));
});

gulp.task ('init', ['stylus']);

gulp.task ('browser-sync',['init'], function () {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  })
});

gulp.task ('watch',['browser-sync'], function () {
  gulp.watch(paths.html).on('change', browserSync.reload)
  gulp.watch(paths.styles).on('change', browserSync.reload)
  gulp.watch(paths.stylus,['stylus']);
});

gulp.task ('clean', function () {
  return gulp.src(paths.build, {read: false})
    .pipe(clean());
});

gulp.task ('default', ['init','browser-sync','watch']);
