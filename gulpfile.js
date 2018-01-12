var gulp = require('gulp');

var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var Server = require('karma').Server;

var BUILD_FOLDER = "build";

gulp.task('default', function() {
    gulp.start('buildJS', 'minify-css', 'copyFolders');
});

gulp.task('buildJS', function() {
    return gulp.src('./public/index.html')
        .pipe(usemin({
            js: [ uglify()],
            inlinejs: [ uglify() ]
        }))
        .pipe(gulp.dest(BUILD_FOLDER + '/'));
});

gulp.task('minify-css', function() {
    return gulp.src('./public/css/*.css')
        .pipe(cleanCSS(/*{compatibility: 'ie8'}*/))
        .pipe(gulp.dest(BUILD_FOLDER + '/css'));
});

gulp.task('copyFolders', function(){
    var foldersToCopy = ["fonts", "images", "config"];
    var res = foldersToCopy.map(function(folder){
        return gulp.src(['./public/' + folder + '/**/*'])
            .pipe(gulp.dest(BUILD_FOLDER + '/' + folder));
    });

    res.push( //copy service worker
        gulp.src(['./public/sw.js'])
            .pipe(gulp.dest(BUILD_FOLDER))
    );

    return res;
});

// Run test once and exit
gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});