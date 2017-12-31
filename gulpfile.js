var gulp = require('gulp');

var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var Server = require('karma').Server;

gulp.task('default', function() {
    gulp.start('buildJS', 'copyFolders');
});

gulp.task('buildJS', function() {
    return gulp.src('./public/index.html')
        .pipe(usemin({
            js: [ uglify()],
            inlinejs: [ uglify() ]
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('copyFolders', function(){
    var foldersToCopy = ["css", "fonts", "images", "config"];
    var res = foldersToCopy.map(function(folder){
        return gulp.src(['./public/' + folder + '/**/*'])
            .pipe(gulp.dest('build/' + folder));
    });

    res.push( //copy service worker
        gulp.src(['./public/sw.js'])
            .pipe(gulp.dest('build'))
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