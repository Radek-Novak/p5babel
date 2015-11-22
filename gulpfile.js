var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var babel = require('gulp-babel');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var open = require('gulp-open');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var debug = require('gulp-debug');
var merge = require('merge-stream');

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return file !== 'node_modules' && fs.statSync(path.join(dir, file)).isDirectory();
      });
}

gulp.task('scripts', function() {
   var folders = getFolders('.');

   var js = folders.map(function(folder) {
      return gulp.src([folder + '/*.js', '!' + folder + '/bundle.js'])
        .pipe(watch([folder + '/*.js', '!' + folder + '/bundle.js']))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(rename('bundle.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(debug({title: 'Created:'}))
        .pipe(gulp.dest(folder + '/dist'))
        .pipe(connect.reload())
   });

   var html = folders.map(function(folder) {
      return gulp.src([folder + '/*.html'])
        .pipe(watch([folder + '/*.html']))
        .pipe(debug({title: 'Changed:'}))
        .pipe(connect.reload())
   });

   return merge(js, html)
});

gulp.task('webserver', function() {
  connect.server({
    livereload: true
    //root: ['.'] // this results in a bug ?!
  });
});

gulp.task('openBrowser', function(){
    gulp.src('').pipe(open({uri: 'http://localhost:8080/'}));
});


gulp.task('default', ['scripts', 'webserver']);
