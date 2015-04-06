var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var server = require('gulp-server-livereload');
var less = require('gulp-less');

var path = {
  HTML: './client/src/*',
  CSS: './client/src/css/*.css',
  MINIFIED_OUT: 'bundle.min.js',
  OUT: 'bundle.js',
  DEST: './client/dist',
  DEST_BUILD: './client/dist/build',
  DEST_SRC: './client/dist/src',
  ENTRY_POINT: './client/src/js/App.jsx'
};

gulp.task('build', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
  })
    .bundle()
    .pipe(source(path.MINIFIED_OUT))
    .pipe(streamify(uglify(path.MINIFIED_OUT)))
    .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('less', function(){
  return gulp.src('./client/src/css/main.less')
    .pipe(less({path: '/'}))
    .pipe(gulp.dest(path.DEST + '/css'))
});

gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});

gulp.task('copyCSS', function(){
    gulp.src(path.CSS)
      .pipe(gulp.dest(path.DEST + '/css'));
})

// gulp.task('build', function () {
//   return gulp.src(path.ENTRY_POINT)
//       .pipe(react())
//       .pipe(gulp.dest(path.DEST_JS));
// });

gulp.task('webserver', function() {
  gulp.src('./client/dist')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      defaultFile: '/index.html',
      open: true
    }));
});

gulp.task('watchProd', function(){
  gulp.watch(['client/src/index.html', 'client/src/styles.css', 'client/src/js/*.jsx', 'client/src/js/components/*.jsx'], ['production'])
});

gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'css': ['./css/main.css', './css/styles.css'],
      'js': 'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));
});

gulp.task('watch', function() {
  gulp.watch(path.HTML, ['copy']);

  var watcher  = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher.on('update', function () {
    watcher.bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST_SRC))
      console.log('Updated');
  })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('production', ['less', 'copy', 'copyCSS', 'replaceHTML', 'build']);
gulp.task('localtest', ['production', 'webserver', 'watchProd']);
gulp.task('default', ['watch']);















