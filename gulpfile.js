var gulp = require('gulp');
var clean = require('gulp-clean');
var stylus = require('gulp-stylus');
var cssbeautify = require('gulp-cssbeautify');
var browserSync = require('browser-sync').create();
var gm = require('gulp-gm');var gm = require('gulp-gm');
var fs = require('fs-extra');
var rename = require('gulp-rename');

var paths = {
  html : ['*.html'],
  styles : ['*.css'],
  stylus : ['stylus/**/*.styl'],
  clean : ['styles.css'],
  imgSrc : ['./images/*.JPG'], // logo and main img small jpg
  img1080 : './images/h1080',
  img720 : './images/h720',
  img360 : './images/h360',
  imgMain : './images/IMG_2944.jpg',
  imgMainCrop : 'IMG_2944.JPG',
  imgDirMainCrop : './images/'
}

var globals = {
  imgDst : "",
  imgSiz : 0,
  imgCln : [paths.img1080, paths.img720, paths.img360,
    paths.imgDirMainCrop + paths.imgMainCrop]
}

function imgProcessSize(size, dest) {
  fs.mkdirpSync(dest);
  return gulp.src(paths.imgSrc)
    .pipe(gm(function(gmfile) {
      return gmfile.resize(null,size)
    }))
    .pipe(gulp.dest(dest));
}

gulp.task ('imgProcess1080', ['imgCrop'], function () { return imgProcessSize(1080, paths.img1080) });
gulp.task ('imgProcess720', ['imgCrop'], function () { return imgProcessSize(720, paths.img720) });
gulp.task ('imgProcess360', ['imgCrop'], function () { return imgProcessSize(360, paths.img360) });

gulp.task ('imgProcess', ['imgProcess360','imgProcess720','imgProcess1080']);

gulp.task ('imgCrop', function () {
  return gulp.src(paths.imgMain)
    .pipe(gm(function(gmfile,done) {
      gmfile.size(function (err, size) {
        done(null, gmfile.crop(size.width,size.height*0.7,0,0));
      });
    }))
    .pipe(rename(paths.imgMainCrop))
    .pipe(gulp.dest(paths.imgDirMainCrop));
});

gulp.task ('imgClean', function () {
  return gulp.src(globals.imgCln, {read: false})
    .pipe(clean());
});

gulp.task ('stylus', function () {
  return gulp.src('./stylus/*.styl')
    .pipe(stylus())
    .pipe(cssbeautify())
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
